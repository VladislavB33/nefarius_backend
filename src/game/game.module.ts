import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Player } from 'src/player/player.entity';
import { GameGateway } from 'src/gateway/gamegateway.gateway';


@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway],
  imports: [
    TypeOrmModule.forFeature([Game, Player]),
    GameGateway,
  ],
})
export class GameModule {}
