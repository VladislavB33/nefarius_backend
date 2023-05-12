import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Engine } from 'src/gameengine/engine';
import { Action, InventionCard, Turn } from 'src/gameengine/types';
import { SocketPlayer } from './gateway.service';
import { v4 as uuidv4 } from 'uuid'

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
    handleConnection(client: any, ...args: any[]) {
        console.log('Client connected')
        console.log('Client id', client.id)

    }
    @WebSocketServer() server: Server;

    private players: SocketPlayer[] = [];
    private engine: Engine;
    

    @SubscribeMessage('createRoom')
    handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): void {
      client.join(roomName);
      this.server.to(client.id).emit('roomCreated', roomName);
      console.log(roomName)
    }
  
    // @SubscribeMessage('joinRoom')
    // handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): void {
    //   const room = this.rooms.get(roomId);
    //   if (room) {
    //     room.add(client);
    //     client.join(roomId);
    //     this.server.to(roomId).emit('userJoined', client.id);
    //   } else {
    //     this.server.to(client.id).emit('roomNotFound');
    //   }
    // }
    
    @SubscribeMessage('start')
    async start(
        @ConnectedSocket() socket: Socket)
     {
        if (this.players.length >= EXPECTED_PLAYERS) {
            socket.emit('status', { status: PlayerStatus.ERROR, message: 'This game is full' });
            socket.disconnect();
        } else {
            const player = new SocketPlayer(socket);
            this.players.push(player);
            console.log('Connected new socket')
            socket.emit('status', { status: PlayerStatus.REGISTERED, index: this.players.length - 1 });
            if (this.players.length === EXPECTED_PLAYERS) {

                this.startGame();
            }
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

function generateUniqueId(): string {
    const roomId = uuidv4();
    return roomId;
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