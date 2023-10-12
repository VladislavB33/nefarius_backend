import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Game } from 'src/game/game.entity';
import { Player } from 'src/player/player.entity';
import { Repository } from 'typeorm';
import { RoomGateway } from './roomgateway';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
    private rooms: { [roomId: string]: RoomGateway } = {}

    constructor(private authService: AuthService,
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(Player) private playerRepository: Repository<Player>,) { }

    async handleConnection(socket: Socket) {
        const { token } = socket.handshake.query;
        console.log('токен:', socket.handshake.query)

        // вроде и не надо
        // await this.authService.validateToken(token);
        // console.log('Валидированный токен:', await this.authService.validateToken(token))
        const decodeToken = await this.authService.decodeToken(token);
        
        console.log('декодированный токен:', decodeToken)
        //проверять количество участников
        //проверять пользователя в комнате???
        const game = await this.gameRepository.findOne({
            relations: ['players'],
            where: {
                id: +decodeToken.roomId,
            },
        })
        console.log('game:', game)
        console.log('game:', game.players.length)
        // eslint-disable-next-line no-void
        
        // выкинуть пользователей если комната не собралась
        await socket.join(decodeToken.roomId)
        if (!this.rooms[decodeToken.roomId]) {
            this.rooms[decodeToken.roomId] = new RoomGateway(decodeToken.roomId, game.players.length);
        }

        this.rooms[decodeToken.roomId].clientConnected(socket);
        console.log('this.rooms:', this.rooms)
        await this.server.to(decodeToken.roomId).emit('connected', `user ${decodeToken.userId} connected to room ${decodeToken.roomId}`)

    }

    @WebSocketServer() server: Server;
}
