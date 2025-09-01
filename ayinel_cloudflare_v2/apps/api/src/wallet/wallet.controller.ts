import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { 
  CreateTransactionDto, 
  WalletResponseDto, 
  TransactionResponseDto,
  AddFundsDto,
  WithdrawFundsDto,
  TransferFundsDto 
} from '@ayinel/types';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Request() req): Promise<WalletResponseDto> {
    return this.walletService.getUserWallet(req.user.id);
  }

  @Get('transactions')
  async getTransactions(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: string,
  ): Promise<{ transactions: TransactionResponseDto[]; total: number; page: number; totalPages: number }> {
    return this.walletService.getUserTransactions(req.user.id, page, limit, type);
  }

  @Post('add-funds')
  async addFunds(
    @Request() req,
    @Body() dto: AddFundsDto,
  ): Promise<TransactionResponseDto> {
    return this.walletService.addFunds(req.user.id, dto);
  }

  @Post('withdraw')
  async withdrawFunds(
    @Request() req,
    @Body() dto: WithdrawFundsDto,
  ): Promise<TransactionResponseDto> {
    return this.walletService.withdrawFunds(req.user.id, dto);
  }

  @Post('transfer')
  async transferFunds(
    @Request() req,
    @Body() dto: TransferFundsDto,
  ): Promise<TransactionResponseDto> {
    return this.walletService.transferFunds(req.user.id, dto);
  }

  @Get('transactions/:id')
  async getTransaction(
    @Request() req,
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    return this.walletService.getTransaction(req.user.id, id);
  }

  @Get('stats')
  async getWalletStats(@Request() req) {
    return this.walletService.getWalletStats(req.user.id);
  }

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Request() req,
    @Body() dto: AddFundsDto,
  ) {
    return this.walletService.createPaymentIntent(req.user.id, dto);
  }

  @Post('confirm-payment')
  async confirmPayment(
    @Request() req,
    @Body() dto: { paymentIntentId: string; transactionId: string },
  ): Promise<TransactionResponseDto> {
    return this.walletService.confirmPayment(req.user.id, dto.paymentIntentId, dto.transactionId);
  }
}
