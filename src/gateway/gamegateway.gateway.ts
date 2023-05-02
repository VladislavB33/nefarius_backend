import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Engine } from 'src/gameengine/engine';
import { Action, InventionCard, Turn } from 'src/gameengine/types';
import { SocketPlayer } from './gateway.service';
import { OnModuleInit } from '@nestjs/common';

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
        //   console.log('Client connected:', client)
        console.log(client.id);

    }



    @WebSocketServer() server: Server;
    gatewayConection() {
        this.server.on('connection', (socket) => {
            console.log('connected'),
                console.log(socket.id)
        })
    }

    private players: SocketPlayer[] = [];
    private engine: Engine;


    @SubscribeMessage('data')
    handleData(
        @MessageBody() data: string,
        @ConnectedSocket() socket: Socket) {
            this.server.emit('data', data)
            console.log(data)
            this.processSocket(socket)
            this.processData(data)
            return data
        }
    processSocket(socket) {
        console.log(socket.id);
    }
    processData(data: string) {
        console.log(data);
    }

    
        // if (this.players.length >= EXPECTED_PLAYERS) {
        //   socket.send({ status: PlayerStatus.ERROR, message: 'This game is full' });
        //   socket.disconnect();
        // } else {
        //   const player = new SocketPlayer(socket, data);
        //   this.players.push(player);
        //   console.log('Connected new socket')
        //   socket.send({ status: PlayerStatus.REGISTERED, index: this.players.length - 1 });
        //   if (this.players.length === EXPECTED_PLAYERS) {

        //     this.startGame();
        //   }
        // }
    

    //   async startGame() {
    //     for (const player of this.players) {
    //       player.socket.send({ status: PlayerStatus.STARTED });
    //     }
    //     this.engine = new Engine(this.players);
    //     const winner = await this.engine.start();
    //     const winnerIndex = this.players.findIndex((player) => player === winner);
    //     for (const player of this.players) {
    //       player.socket.send({ status: PlayerStatus.FINISHED, winnerIndex });
    //       player.socket.disconnect()
    //     }

    //   }
}


async function sleep(ms: number): Promise<void> {
    return await new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}