import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.entity';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async register(@Body() playerDto: CreatePlayerDto): Promise<void>  {
    await this.playerService.createPlayer(playerDto);
  }

  
}
