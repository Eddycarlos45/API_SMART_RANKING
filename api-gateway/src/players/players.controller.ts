import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/common/proxymrq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createCaregory(@Body() createPlayerDTO: CreatePlayerDTO) {
    this.logger.log(`createPlayerDTO: ${JSON.stringify(createPlayerDTO)}`);
    const category = await this.clientAdminBackend
      .send('get-categories', createPlayerDTO.category)
      .toPromise();

    if (category) {
      this.clientAdminBackend.emit('create-player', createPlayerDTO);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Get()
  getCategories(@Query('idPlayer') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-players', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id') _id: string,
  ) {
    this.logger.log(`updatePlayerDTO: ${JSON.stringify(updatePlayerDTO)}`);
    const category = await this.clientAdminBackend
      .send('get-categories', updatePlayerDTO.category)
      .toPromise();

      if (category) {
        this.clientAdminBackend.emit('update-player', {
          id: _id,
          player: updatePlayerDTO,
        });
      } else {
        throw new BadRequestException(`Categoria não cadastrada!`);
      }
  }

  @Delete('/:_id')
  deletePlayer(@Param('_id') _id: string){
    this.clientAdminBackend.emit('delete-player', {_id})
  }
}
