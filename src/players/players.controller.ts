import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxymrq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';

@Controller('api/v1')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post('players')
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
}
