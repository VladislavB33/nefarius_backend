import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { Player } from 'src/player/player.entity';
import { CreateGameDto } from './dto/create-game-dto';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(Player) private playerRepository: Repository<Player>) { }

    async createGame(dto: CreateGameDto, id: number) {
        try {
            const player = await this.playerRepository.findOneBy({ id })
            const player2 = await this.playerRepository.findOneBy({ id: 7 })


            const newGame = new Game()
            newGame.title = dto.title;
            newGame.password = dto.password
            newGame.players = [player, player2]
            return await this.gameRepository.save(newGame)

        } catch (error) {
            throw new Error
        }
    }
}
