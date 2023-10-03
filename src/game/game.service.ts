import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from 'src/player/player.entity';
import { CreateGameDto } from './dto/create-game-dto';
import { Game } from './game.entity';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        @InjectRepository(Player) private playerRepository: Repository<Player>,
    ) { }

    async createGame(dto: CreateGameDto, id: number) {
        try {
            const player = await this.playerRepository.findOneBy({ id });
            const newGame = new Game();
            newGame.title = dto.title;
            newGame.password = dto.password;
            newGame.players = [player];
            return await this.gameRepository.save(newGame);
        } catch (error) {
            throw new Error();
        }
    }

    async joinGame(roomId, playerId) {
        const game = await this.gameRepository.findOne({
            relations: ['players'],
            where: {
                id: roomId,
            },
        });
        const player = await this.playerRepository.findOne({
            where: { id: playerId },
        });

        game.players.push(player);
        return this.gameRepository.save(game);
    }

    async leaveGame(roomId, playerId) {
        const game = await this.gameRepository.findOne({
            relations: ['players'],
            where: {
                id: roomId,
            },
        });
        if (!game) {
            throw new NotFoundException('Game not found');
        }
        const playerIndex = game.players.findIndex((player) => player.id === playerId);

        if (playerIndex === -1) {
            throw new NotFoundException('Game not found in game');
        }
        game.players.splice(playerIndex, 1);
        return this.gameRepository.save(game);
    }

    async findAllGame() {
        try {
            return await this.gameRepository.find({
                relations: ['players'],
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async findOneGame(gameId) {
        try {
            const game = this.gameRepository.findOne({
                relations: ['players'],
                where: {
                    id: gameId,
                },
            });
            return await game;
        } catch {
            throw new Error();
        }
    }
}
