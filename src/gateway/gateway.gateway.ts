import { WebSocketGateway } from '@nestjs/websockets';
import { GatewayService } from './gateway.service';

@WebSocketGateway(parseInt('.${process.env.NODE_ENV}.env'), {} )
export class GatewayGateway {
  constructor(private readonly gatewayService: GatewayService) {}




}
