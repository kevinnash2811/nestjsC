import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class HanrtPlanificadorWs implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    return { status: 'joined', roomId: data.roomId };
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    return { status: 'left', roomId: data.roomId };
  }

  @SubscribeMessage('hanrt_planificador@save')
  async save(@MessageBody() data: { roomId: string }): Promise<any> {
    if (data.roomId) {
      this.server.to(data.roomId).emit('registro.actualizado', {
        estado: 'COMPLETADO',
        id: data.roomId,
      });
    }

    return { status: 'success', message: 'Data saved successfully' };
  }
}
