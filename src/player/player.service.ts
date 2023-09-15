import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.entity';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    private readonly configService: ConfigService) { }

  async createPlayer(dto: CreatePlayerDto) {
    const existPlayer = await this.playersRepository.findOne({
      where: {
        email: dto.email
      }
    })

    if (existPlayer) {
      throw new HttpException('User with this email exists', HttpStatus.BAD_REQUEST)
    }
    const hmac = crypto.createHmac('sha256', this.configService.get('HASH_SECRET'));
    hmac.update(dto.password);
    const hashedPassword = hmac.digest('hex');
    try {
      const player = await this.playersRepository.save({
        email: dto.email,
        password: hashedPassword
      })
      return player
    } catch (e) {
      throw new Error(e)
    }
  }


  async getAllPlayerByEmail() {
    try {
      return await this.playersRepository.find()
    } catch (error) {
      throw new Error(error)
    }
  }


  async updatePlayer(dto: CreatePlayerDto, id: number) {
    try {
      let player = await this.playersRepository.findOneBy({ id })

      const hmac = crypto.createHmac('sha256', this.configService.get('HASH_SECRET'));
      hmac.update(dto.password);
      const hashedPassword = hmac.digest('hex');

      player.email = dto.email;
      player.password = hashedPassword;

      const updatedPlayer = await this.playersRepository.save(player);
      return updatedPlayer;
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteUser(id: number) {

    let player = await this.playersRepository.findOneBy({ id })
    if (!player) { throw new NotFoundException('User not found') }
    await this.playersRepository.delete(player);
    throw new HttpException('User deleted', HttpStatus.OK)
  }
}
