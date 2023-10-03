import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GameGateway } from './gamegateway.gateway';

@Module({
    controllers: [],
    providers: [GameGateway],
    exports: [GameGateway],
    imports: [AuthModule],

})
export class GatewayModule {}
