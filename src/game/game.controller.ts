import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game-dto';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll(@Query('status') status): Promise<Game[]> {
    return this.gameService.findAll()
  }

  @Get(':id')
  async findById(): Promise<void> {

  }

  @Post()
  async createGame(@Body() gameDto: CreateGameDto): Promise<void> {
    await this.gameService.createGame(gameDto)
  }

  @Post('join')
  joinGame(): Promise<string> {
    return Promise.resolve('testToken')
  }

}
