import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    try {
      // Extract user ID from JWT token (you'll need to implement JWT verification)
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization;

      if (!token) {
        client.disconnect();
        return;
      }

      // TODO: Verify JWT token and extract user ID
      // For now, we'll use a placeholder
      const userId = 'user-id-from-token';

      this.connectedUsers.set(client.id, userId);

      console.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      await this.chatService.joinRoom(data.roomId, userId);
      client.join(data.roomId);

      client.emit('joined_room', { roomId: data.roomId });

      // Notify others in the room
      client.to(data.roomId).emit('user_joined', {
        userId,
        roomId: data.roomId,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      await this.chatService.leaveRoom(data.roomId, userId);
      client.leave(data.roomId);

      client.emit('left_room', { roomId: data.roomId });

      // Notify others in the room
      client.to(data.roomId).emit('user_left', {
        userId,
        roomId: data.roomId,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; text: string; replyToId?: string }
  ) {
    try {
      const userId = this.connectedUsers.get(client.id);
      if (!userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const message = await this.chatService.sendMessage(data.roomId, userId, {
        text: data.text,
        replyToId: data.replyToId,
      });

      // Broadcast message to all users in the room
      this.server.to(data.roomId).emit('new_message', message);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      client.to(data.roomId).emit('user_typing', {
        userId,
        roomId: data.roomId,
      });
    }
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      client.to(data.roomId).emit('user_stopped_typing', {
        userId,
        roomId: data.roomId,
      });
    }
  }

  // Helper method to get user ID from socket
  private getUserIdFromSocket(client: Socket): string | null {
    return this.connectedUsers.get(client.id) || null;
  }
}
