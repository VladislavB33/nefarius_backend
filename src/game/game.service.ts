import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game-dto';
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

  async createGame(dto: CreateGameDto): Promise<number> {
    const game = await this.usersRepository.create(dto);
    return game.id;
  }

  findOne(id: string): Promise<Game> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}