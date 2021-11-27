import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private usersRepository: Repository<Game>,
  ) {}

  findAll(): Promise<Game[]> {
    return this.usersRepository.find();
  }

  async create(body: any): Promise<number> {
    const game = await this.usersRepository.create(body);
    return game[0].id;
  }

  findOne(id: string): Promise<Game> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}