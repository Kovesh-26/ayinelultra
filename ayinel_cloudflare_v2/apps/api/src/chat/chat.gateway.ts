import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.roomId);
    return { event: 'joinedRoom', roomId: data.roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { roomId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.roomId);
    return { event: 'leftRoom', roomId: data.roomId };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { roomId: string; message: string }, @ConnectedSocket() client: Socket) {
    this.server.to(data.roomId).emit('newMessage', {
      roomId: data.roomId,
      message: data.message,
      userId: client.id,
      timestamp: new Date(),
    });
    return { event: 'messageSent', roomId: data.roomId };
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { roomId: string; isTyping: boolean }, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('userTyping', {
      roomId: data.roomId,
      userId: client.id,
      isTyping: data.isTyping,
    });
    return { event: 'typingStatus', roomId: data.roomId };
  }
}
