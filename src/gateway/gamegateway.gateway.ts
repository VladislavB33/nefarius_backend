import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Engine } from 'src/gameengine/engine';
import { Action, InventionCard, Turn } from 'src/gameengine/types';
import { SocketPlayer } from './gateway.service';

const EXPECTED_PLAYERS = 2;
export enum PlayerStatus {
    REGISTERED,
    STARTED,
    ERROR,
    FINISHED
}

export enum Method {
    GIVE_CARDS,
    RETURN_SPY,
    SEND_SPY,
    SET_MONEY,
    TAKE_OFF_CARDS,
    TURN
}

export interface SocketMessage {
    method: Method
    action?: Action
    cards?: InventionCard[]
    cardIds?: string[]
    turn?: Turn
    count?: number
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
    handleConnection(client: Socket) {
        console.log('Client connected')
        console.log('Client id', client.id)

    }
    @WebSocketServer() server: Server;

    private players: SocketPlayer[] = [];
    private engine: Engine;


    private games: Record<string, Set<Socket>> = {};

    @SubscribeMessage('joinGame')
    handleJoinGame(client: Socket, gameName: string) {
      if (!this.games[gameName]) {
        this.games[gameName] = new Set();
      }
      this.games[gameName].add(client);
    }

    @SubscribeMessage('start')
    async start(
        @ConnectedSocket() socket: Socket) {

        const player = new SocketPlayer(socket);
        this.players.push(player);
        console.log('Connected new socket')
        socket.emit('status', { status: PlayerStatus.REGISTERED, index: this.players.length - 1 });
        if (this.players.length === EXPECTED_PLAYERS) {

            this.startGame();
        }

    }

    async startGame() {
        for (const player of this.players) {
            player.socket.emit('status', { status: PlayerStatus.STARTED });
        }
        this.engine = new Engine(this.players);
        const winner = await this.engine.start();
        const winnerIndex = this.players.findIndex((player) => player === winner);
        for (const player of this.players) {
            player.socket.emit('status', { status: PlayerStatus.FINISHED, winnerIndex });
            player.socket.disconnect()
        }


    }
}

async function sleep(ms: number): Promise<void> {
    return await new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}


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


//   }