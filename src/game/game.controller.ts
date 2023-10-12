import {
    Body, Controller, Get, Param, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { GameGateway } from 'src/gateway/gamegateway.gateway';
import { AuthService } from 'src/auth/auth.service';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game-dto';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService,
        private gameGateway: GameGateway,
        private authService: AuthService,
    ) { }


    @Post()
    @UseGuards(JwtAuthGuard)
    async createGame(@Body() dto: CreateGameDto, @Req() req) {
        const game = await this.gameService.createGame(dto, +req.user.id);
        const token = await this.authService.generateToken(`${game.id}`, +req.user.id)
        this.gameGateway.server.emit('newGameCreated', game);
        
        console.log(game);
        return { game, token};
    }

    // Удалить после тестов
    @Get('token/:token')
    async decodeToken(@Param('token') token: string) {
        const Itoken = await this.authService.decodeToken(token);
        console.log(Itoken);
        return (Itoken);
    }
    // проверять количество участников
    @Patch(':roomId/join')
    @UseGuards(JwtAuthGuard)
    async joinGame(@Param('roomId') roomId: string, @Req() req) {
        try {
            const game = await this.gameService.joinGame(roomId, +req.user.id);
            const token = await this.authService.generateToken(`${game.id}`, +req.user.id);
            await this.gameGateway.server.emit('playerJoned', { roomId, playerId: +req.user.id });
            return { game, token };
        } catch (e) {
            throw new Error();
        }
    }

    @Patch(':roomId/leaveGame')
    @UseGuards(JwtAuthGuard)
    async leaveGame(@Param('roomId') roomId: string, @Req() req) {
        try {
            const game = await this.gameService.leaveGame(roomId, +req.user.id);
            await this.gameGateway.server.emit('playerLiave', { roomId, playerId: +req.user.id });
            return game;
        } catch (e) {
            throw new Error();
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllGame() {
        return this.gameService.findAllGame();
    }

    @Get(':roomId')
    @UseGuards(JwtAuthGuard)
    async findOneGame(@Param('roomId') roomId: string) {
        return this.gameService.findOneGame(roomId);
    }
}
