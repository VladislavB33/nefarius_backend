import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger/dist';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) { }

  @ApiOperation({ summary: 'Create player' })
  @Post()
  register(@Body() playerDto: CreatePlayerDto) {
    return this.playerService.createPlayer(playerDto);
  }

  @ApiOperation({ summary: 'Get all players' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllPlayersByEmail() {
    return this.playerService.getAllPlayerByEmail()
  }

  @ApiOperation({ summary: 'Update player' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  updatePlayer(@Body() playerDto: CreatePlayerDto, @Req() req) {
    return this.playerService.updatePlayer(playerDto, +req.player.id)
  }

  @ApiOperation({ summary: 'Delete player' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() req) {
    return this.playerService.deleteUser(+req.player.id)
  }

}
