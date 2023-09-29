import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/player/player.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

export interface IPlayer {
    id: string,
    email: string
}

@Injectable()
export class AuthService {
    constructor(@InjectRepository(Player) private playerRepository: Repository<Player>,
        private jwtService: JwtService,
        private readonly configService: ConfigService) { }

    async login(player: IPlayer) {
        const { id, email } = player
        return {
            id, email, token: this.jwtService.sign({ id: player.id, email: player.email })
        }
    }

    async validatePlayer(email: string, password: string) {
        const hmac = crypto.createHmac('sha256', this.configService.get('HASH_SECRET'));
        hmac.update(password);
        const hashedPassword = hmac.digest('hex');

        const player = await this.getPlayerByEmail(email)

        if (player && hashedPassword === player.password) {
            return player
        }
        throw new UnauthorizedException({ message: 'Incorrect email or password' })
    }

    async getPlayerByEmail(email: string) {
            const player = await this.playerRepository.findOneBy({ email })
            if (!player) {
                throw new NotFoundException('User with this email does not exist')
            }
            return player
    }

    async generateToken(userId, roomId) {
        return { token: this.jwtService.sign({ userId, roomId }) }
    }

    async validateToken(token) {
        return this.jwtService.verify(token)
    }

    async decodeToken(token) {
        return this.jwtService.decode(token)
    }


}