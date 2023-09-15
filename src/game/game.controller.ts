import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game-dto';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { GameGateway } from 'src/gateway/gamegateway.gateway';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService,
        private gameGateway: GameGateway) { }
    @Post()
    @UseGuards(JwtAuthGuard)
    async createGame(@Body() dto: CreateGameDto, @Req() req) {
        const game = await this.gameService.createGame(dto, +req.user.id)
        this.gameGateway.server.emit('newGameCreated', game)
        console.log(game)
        return game
    }
}
