import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Player } from 'src/player/player.entity';
import { GameGateway } from 'src/gateway/gamegateway.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayModule } from 'src/gateway/gateway.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';


@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, AuthService],
  imports: [
    TypeOrmModule.forFeature([Game, Player]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' }
      }),
      inject: [ConfigService]
    }),
    GatewayModule,
    AuthModule
  ],
})
export class GameModule { }
