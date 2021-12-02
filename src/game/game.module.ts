import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/player/player.entity';
import { PlayerModule } from 'src/player/player.module';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
    TypeOrmModule.forFeature([Game]),

    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Player, Game],
      synchronize: true,
      autoLoadEntities: true,
    }),

    PlayerModule,
  ],
})
export class GameModule {}