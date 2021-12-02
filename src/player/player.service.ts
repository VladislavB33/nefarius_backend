import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(@InjectRepository(Player)private usersRepository: Repository<Player>,) {}

  findAll(): Promise<Player[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Player> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createPlayer(dto: CreatePlayerDto){
    const player = await this.usersRepository.create(dto);
    return player;

  }
}