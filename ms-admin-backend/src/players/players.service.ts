import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {IPlayer} from './interfaces/player.interface'

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel('players') private readonly playerModel: Model<IPlayer>,
      ) {}
    
      private readonly logger = new Logger(PlayersService.name);
    
      async createPlayer(player: IPlayer): Promise<IPlayer> {
        const { email } = player;
        try {
            const playerFound = await this.playerModel.findOne({ email }).exec();
        if (playerFound) {
          throw new BadRequestException(`Jogador com email ${email} já cadastrado`);
        }
        const playerCreated = new this.playerModel(player);
    
        return await playerCreated.save(); 
        } catch (error) {
            throw new RpcException(`erro: ${error.message}`)
        }
       
      }
    
      async updatePlayer(_id: string, player: IPlayer): Promise<void> {
          try {
            const playerFound = await this.playerModel.findOne({ _id }).exec();
        
            if (!playerFound) {
              throw new NotFoundException(`Jogador com o id ${_id} não encontrado`);
            }
            await this.playerModel.findOneAndUpdate({ _id }, { $set: player }).exec(); 
          } catch (error) {
            throw new RpcException(`erro: ${error.message}`)
          }
      }
    
      async findPlayerbyId(_id: string): Promise<IPlayer> {
          try {
            const foundPlayer = await this.playerModel.findOne({ _id }).exec();
            if (!foundPlayer) {
              throw new NotFoundException(`Jogador com Id ${_id} não encontrado`);
            }
            return foundPlayer; 
          } catch (error) {
            throw new RpcException(`erro: ${error.message}`)   
          }
      }
    
      async listAllPlayers(): Promise<IPlayer[]> {
          try {
            return await this.playerModel.find().exec();
          } catch (error) {
            throw new RpcException(`erro: ${error.message}`)    
          }
      }
    
      async deletePlayer(_id: string): Promise<any> {
          try {
            const foundPlayer = await this.playerModel.findOne({ _id }).exec();
            if (!foundPlayer) {
              throw new NotFoundException(`Jogador com Id ${_id} não encontrado`);
            }
            return await this.playerModel.deleteOne({ _id }).exec();  
          } catch (error) {
            throw new RpcException(`erro: ${error.message}`)    
          }
      }
}
