import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game-dto';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  async createGame(dto: CreateGameDto): Promise<number> {
    const game = await this.gameRepository.create(dto);
    return game.id;
  }

  async findOne(gameId: number): Promise<Game> {
    return this.gameRepository.findOneBy({ id: gameId });
  }


  


  async remove(id: string): Promise<void> {
    await this.gameRepository.delete(id);
  }
}
