import { Module } from '@nestjs/common';

import { SocketPlayer } from './gateway.service';
import { GameGateway } from './gamegateway.gateway';



@Module({
  providers: [GameGateway, SocketPlayer, ]
})
export class GatewayModule {}
