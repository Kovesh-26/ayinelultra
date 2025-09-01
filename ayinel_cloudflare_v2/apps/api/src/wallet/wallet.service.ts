import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  WalletResponseDto, 
  TransactionResponseDto, 
  AddFundsDto,
  WithdrawFundsDto,
  TransferFundsDto 
} from '@ayinel/types';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getUserWallet(userId: string): Promise<WalletResponseDto> {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    return this.mapToWalletResponse(wallet);
  }

  async getUserTransactions(
    userId: string,
    page: number = 1,
    limit: number = 20,
    type?: string,
  ): Promise<{ transactions: TransactionResponseDto[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map(tx => this.mapToTransactionResponse(tx)),
      total,
      page,
      totalPages,
    };
  }

  async addFunds(userId: string, dto: AddFundsDto): Promise<TransactionResponseDto> {
    const { amount, paymentMethod, description } = dto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount,
        status: 'PENDING',
        description: description || 'Wallet deposit',
        paymentMethod,
      },
    });

    // Update wallet balance
    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    return this.mapToTransactionResponse(transaction);
  }

  async withdrawFunds(userId: string, dto: WithdrawFundsDto): Promise<TransactionResponseDto> {
    const { amount, withdrawalMethod, accountDetails, description } = dto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.getUserWallet(userId);
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        amount: -amount, // Negative for withdrawals
        status: 'PENDING',
        description: description || 'Wallet withdrawal',
        withdrawalMethod,
        accountDetails,
      },
    });

    // Update wallet balance
    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    return this.mapToTransactionResponse(transaction);
  }

  async transferFunds(senderId: string, dto: TransferFundsDto): Promise<TransactionResponseDto> {
    const { recipientId, amount, description } = dto;

    if (senderId === recipientId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Check if recipient exists
    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    // Check sender's balance
    const senderWallet = await this.getUserWallet(senderId);
    if (senderWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Start transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create sender's transaction
      const senderTransaction = await prisma.transaction.create({
        data: {
          userId: senderId,
          type: 'TRANSFER_OUT',
          amount: -amount,
          status: 'COMPLETED',
          description: description || `Transfer to ${recipient.username}`,
          recipientId,
        },
      });

      // Create recipient's transaction
      const recipientTransaction = await prisma.transaction.create({
        data: {
          userId: recipientId,
          type: 'TRANSFER_IN',
          amount,
          status: 'COMPLETED',
          description: description || `Transfer from ${senderWallet.userId}`,
          senderId,
        },
      });

      // Update sender's balance
      await prisma.wallet.update({
        where: { userId: senderId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Update recipient's balance
      await prisma.wallet.update({
        where: { userId: recipientId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return senderTransaction;
    });

    return this.mapToTransactionResponse(result);
  }

  async getTransaction(userId: string, transactionId: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.mapToTransactionResponse(transaction);
  }

  async getWalletStats(userId: string) {
    const wallet = await this.getUserWallet(userId);
    
    const [totalDeposits, totalWithdrawals, totalTransfers] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'DEPOSIT', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'WITHDRAWAL', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { 
          userId, 
          type: { in: ['TRANSFER_IN', 'TRANSFER_OUT'] }, 
          status: 'COMPLETED' 
        },
        _sum: { amount: true },
      }),
    ]);

    const monthlyStats = await this.getMonthlyStats(userId);

    return {
      currentBalance: wallet.balance,
      totalDeposits: totalDeposits._sum.amount || 0,
      totalWithdrawals: Math.abs(totalWithdrawals._sum.amount || 0),
      totalTransfers: totalTransfers._sum.amount || 0,
      monthlyStats,
    };
  }

  async createPaymentIntent(userId: string, dto: AddFundsDto) {
    // In a real implementation, this would integrate with Stripe or another payment processor
    const { amount } = dto;

    // Mock payment intent creation
    const paymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency: 'usd',
      status: 'requires_payment_method',
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 18)}`,
    };

    return paymentIntent;
  }

  async confirmPayment(userId: string, paymentIntentId: string, transactionId: string): Promise<TransactionResponseDto> {
    // In a real implementation, this would verify the payment with the payment processor
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
        status: 'PENDING',
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found or already processed');
    }

    // Update transaction status
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'COMPLETED' },
    });

    return this.mapToTransactionResponse(updatedTransaction);
  }

  private async getMonthlyStats(userId: string) {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const [deposits, withdrawals, transfers] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: {
          userId,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          userId,
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: {
          userId,
          type: { in: ['TRANSFER_IN', 'TRANSFER_OUT'] },
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      deposits: deposits._sum.amount || 0,
      withdrawals: Math.abs(withdrawals._sum.amount || 0),
      transfers: transfers._sum.amount || 0,
    };
  }

  private mapToWalletResponse(wallet: any): WalletResponseDto {
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  private mapToTransactionResponse(transaction: any): TransactionResponseDto {
    return {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      description: transaction.description,
      paymentMethod: transaction.paymentMethod,
      withdrawalMethod: transaction.withdrawalMethod,
      accountDetails: transaction.accountDetails,
      senderId: transaction.senderId,
      recipientId: transaction.recipientId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
