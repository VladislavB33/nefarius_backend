import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 200, type: CreatePlayerDto})
  @Post()
  async register(@Body() playerDto: CreatePlayerDto)  {
    return this.playerService.createPlayer(playerDto);
  }

  
}
