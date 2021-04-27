import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

  constructor(private playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    this.playersService.createPlayer(createPlayerDTO)
  }

  @Get()
  getPlayers(@Query('idPlayer') _id: string): Promise<any> {
     return this.playersService.getPlayers(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id') _id: string,
  ) {
    await this.playersService.updatePlayer(updatePlayerDTO, _id)
  }

  @Delete('/:_id')
  deletePlayer(@Param('_id') _id: string){
    this.playersService.deletePlayer(_id)
  }
}
