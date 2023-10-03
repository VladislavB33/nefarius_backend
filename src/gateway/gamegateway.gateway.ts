import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
    constructor(private authService: AuthService) {}

    async handleConnection(socket: Socket) {
        const { token } = socket.handshake.query;

        await this.authService.validateToken(token);
        const data = await this.authService.decodeToken(token);
        // eslint-disable-next-line no-void
        void socket.join(data.roomId);
    }

    @WebSocketServer() server: Server;
}

//     @SubscribeMessage('joinGame')
//     handleJoinGame(client: Socket, gameName: string) {
//       if (!this.games[gameName]) {
//         this.games[gameName] = new Set();
//       }
//       this.games[gameName].add(client);
//     }

//     @SubscribeMessage('start')
//     async start(
//         @ConnectedSocket() socket: Socket) {

//         const player = new SocketPlayer(socket);
//         this.players.push(player);
//         console.log('Connected new socket')
//         socket.emit('status', { status: PlayerStatus.REGISTERED, index: this.players.length - 1 });
//         if (this.players.length === EXPECTED_PLAYERS) {

//             this.startGame();
//         }

//     }

//     async startGame() {
//         for (const player of this.players) {
//             player.socket.emit('status', { status: PlayerStatus.STARTED });
//         }
//         engine = new Engine(this.players);
//         const winner = await this.engine.start();
//         const winnerIndex = this.players.findIndex((player) => player === winner);
//         for (const player of this.players) {
//             player.socket.emit('status', { status: PlayerStatus.FINISHED, winnerIndex });
//             player.socket.disconnect()
//         }

//     }
// }

// async function sleep(ms: number): Promise<void> {
//     return await new Promise((resolve) => {
//         setTimeout(() => resolve(), ms)
//     })
// }

//   @SubscribeMessage('start')
//   async start(
//       @ConnectedSocket() socket: Socket)
//    {
//       if (this.players.length >= EXPECTED_PLAYERS) {
//           socket.emit('status', { status: PlayerStatus.ERROR, message: 'This game is full' });
//           socket.disconnect();
//       } else {
//           const player = new SocketPlayer(socket);
//           this.players.push(player);
//           console.log('Connected new socket')
//           socket.emit('status', { status: PlayerStatus.REGISTERED, index: this.players.length - 1 });
//           if (this.players.length === EXPECTED_PLAYERS) {

//               this.startGame();
//           }
//       }
//   }

//   async startGame() {
//       for (const player of this.players) {
//           player.socket.emit('status', { status: PlayerStatus.STARTED });
//       }
//       this.engine = new Engine(this.players);
//       const winner = await this.engine.start();
//       const winnerIndex = this.players.findIndex((player) => player === winner);
//       for (const player of this.players) {
//           player.socket.emit('status', { status: PlayerStatus.FINISHED, winnerIndex });
//           player.socket.disconnect()
//       }
