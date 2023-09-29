import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game-dto';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { GameGateway } from 'src/gateway/gamegateway.gateway';
import { AuthService } from 'src/auth/auth.service';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService,
        private gameGateway: GameGateway,
        private authService: AuthService) { }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createGame(@Body() dto: CreateGameDto, @Req() req) {
        const game = await this.gameService.createGame(dto, +req.user.id)
        this.gameGateway.server.emit('newGameCreated', game)
        console.log(game)
        return game
    }

    @Patch(':roomId/join')
    @UseGuards(JwtAuthGuard)
    async joinGame(@Param('roomId') roomId: string, @Req() req) {
        try {
            const game = await this.gameService.joinGame(roomId, +req.user.id)
            const token = await this.authService.generateToken(roomId, +req.user.id)
            await this.gameGateway.server.emit('playerJoned', {roomId, playerId: +req.user.id})
            return {game, token}
        }
        catch (e) {
            throw new Error()
        }
    }

    @Patch(':roomId/leaveGame')
    @UseGuards(JwtAuthGuard)
    async leaveGame(@Param('roomId') roomId: string, @Req() req) {
        try{
            const game = await this.gameService.leaveGame(roomId, +req.user.id)
            await this.gameGateway.server.emit('playerLiave', {roomId, playerId: +req.user.id})
            return game
        }
        catch (e) {
            throw new Error()
        }
    }


    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllGame() {
        return this.gameService.findAllGame()
    }

    @Get(':roomId')
    @UseGuards(JwtAuthGuard)
    async findOneGame(@Param('roomId') roomId: string) {
        return this.gameService.findOneGame(roomId)
    }

}
