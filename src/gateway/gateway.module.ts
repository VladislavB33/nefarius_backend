import { Module } from '@nestjs/common';

import { SocketPlayer } from './gateway.service';
import { GameGateway } from './gamegateway.gateway';



@Module({
  providers: [GameGateway ]
})
export class GatewayModule {}
