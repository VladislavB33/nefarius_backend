import { Module } from '@nestjs/common';
import { GameGateway } from './gamegateway.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { GatewayService } from './gateway.service';



@Module({
  controllers: [],
  providers: [GameGateway],
  exports: [GameGateway],
  imports: [AuthModule]

})
export class GatewayModule {}
