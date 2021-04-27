import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/common/proxymrq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {

  private logger = new Logger(PlayersService.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async createPlayer(createPlayerDTO: CreatePlayerDTO) {
    this.logger.log(`createPlayerDTO: ${JSON.stringify(createPlayerDTO)}`);
    const category = await this.clientAdminBackend
      .send('get-categories', createPlayerDTO.category)
      .toPromise();

    if (category) {
      this.clientAdminBackend.emit('create-player', createPlayerDTO);
    } else {
      throw new BadRequestException(`Jogador não cadastrado!`);
    }
  }

  async getPlayers( _id: string): Promise<any> {
    return await this.clientAdminBackend.send('get-players', _id ? _id : '').toPromise();
  }

  async updatePlayer(
   updatePlayerDTO: UpdatePlayerDTO,
   _id: string,
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
        throw new BadRequestException(`Jogador não cadastrado!`);
      }
  }

  deletePlayer( _id: string){
    this.clientAdminBackend.emit('delete-player', {_id})
  }
}
