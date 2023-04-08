import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private playersRepository: Repository<Player>,
  ) {}

  findAll(): Promise<Player[]> {
    return this.playersRepository.find();
  }

  findOne(playerId: number): Promise<Player> {
    return this.playersRepository.findOneBy({id: playerId });
  }

  async remove(id: string): Promise<void> {
    await this.playersRepository.delete(id);
  }

  async createPlayer(dto: CreatePlayerDto) {
    const player = await this.playersRepository.create(dto);
    return player;
  }
}
