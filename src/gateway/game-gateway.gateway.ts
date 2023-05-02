// import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
// import _ from 'lodash';
// import { Server, Socket } from 'socket.io';
// import { Engine } from 'src/gameengine/engine';
// import { PlayerStatus } from 'src/gameengine/example/socket-server-game';
// import { SocketPlayer } from './gateway.service';



// @WebSocketGateway()
// export class GameGateway implements OnGatewayConnection {
//     @WebSocketServer() server: Server;
//   handleConnection(client: any, ...args: any[]) {
//     client.emit('status',  (JSON.stringify({ status: PlayerStatus.ERROR, message: 'Client connected' }) + '\r'))
//       console.log('Client connected')
//       console.log('Client connected:', client)
//       console.log('args', args);
//   }

//   @SubscribeMessage('data')
//   async handleRegister(
//     @MessageBody() data: string,
//     @ConnectedSocket() socket: Socket) {
//     const players: SocketPlayer[] = []
//     let engine: Engine
//     console.log('Connected new client')
//     if (players.length >= 1) {
//       socket.emit('status', (JSON.stringify({ status: PlayerStatus.ERROR, message: 'This game is full' }) + '\r'))
//       socket.disconnect()
//     } else {
      
//       players.push(new SocketPlayer(socket, data))
//       socket.emit('status', (JSON.stringify({ status: PlayerStatus.REGISTERED, index: players.length - 1 }) + '\r'))
//     }
//     engine = new Engine(players)
//     console.log(engine)
//     console.log(data)
//     const winner = await engine.start()
//     return _.findIndex(players, winner)

    

//   }
//   @SubscribeMessage('connected')
//   async handleRegister1() {
//     console.log('Connected new client')
//   }

// }
  



// async function sleep(ms: number): Promise<void> {
//   return await new Promise((resolve) => {
//     setTimeout(() => resolve(), ms)
//   })
// }