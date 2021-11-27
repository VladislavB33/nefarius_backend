import { Controller, Post } from '@nestjs/common';
import { Player } from './player.entity';
import { PlayerService } from './player.service';

@Controller('players')
export class AppController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async register(): Promise<number> {
    // TODO: Implement saving player
    return Promise.resolve(42)
  }
}
