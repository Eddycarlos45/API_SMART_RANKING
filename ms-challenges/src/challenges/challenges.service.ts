import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';
import { IChallenge } from './interfaces/challenge.interface';
import * as momentTimezone from 'moment-timezone';
@Injectable()
export class ChallengesService {

    constructor(
        @InjectModel('Challenge')
        private readonly challengeModel: Model<IChallenge>
      ) {}

      private readonly logger = new Logger(ChallengesService.name);
      
    async createChallenge(
       challenge: IChallenge,
      ): Promise<IChallenge> {
        try {
            const createdChallenge = new this.challengeModel(challenge);

            createdChallenge.dateHourOrder = new Date();
            this.logger.log(
              `createChallenge.dateHour: ${createdChallenge.dateHourOrder}`,
            );
        
            createdChallenge.status = ChallengeStatus.PENDING;
            this.logger.log(`createChalleng: ${JSON.stringify(createdChallenge)}`);
            return await createdChallenge.save();
        } catch (error) {
            throw new RpcException(error.message)
        }
    }

    async findAllChallenges(): Promise<IChallenge[]> {
        try {
            return await this.challengeModel.find().exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async findChallengeByPlayer(_id: any): Promise<IChallenge[] | IChallenge>{
        try {
            return await this.challengeModel.find()
            .where('players')
            .in(_id)
            .exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async findChallengeById(_id:any): Promise<IChallenge> {
        try {
            return await this.challengeModel.findOne({_id})
            .exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async updateChallenge(_id: string, challenge: IChallenge): Promise<void>{
        try {
            challenge.dateHourAnswer = new Date()
            await this.challengeModel.findByIdAndUpdate({_id},{$set: challenge}).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async deleteChallenge(challenge: IChallenge): Promise<void> {
        try {
            const {_id} = challenge

            challenge.status = ChallengeStatus.CANCELED
            this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
            await this.challengeModel.findByIdAndUpdate({_id},{$set: challenge}).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async updateChallengeMatch(idMatch: string, challenge: IChallenge): Promise<void> {
        try {
            challenge.status = ChallengeStatus.FULFILLED
            challenge.match = idMatch
            await this.challengeModel.findOneAndUpdate({_id: challenge._id},{$set: challenge}).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async queryChallengesPerformed(idCategory: string): Promise<IChallenge[]>{
        try {
            return await this.challengeModel.find()
            .where('category')
            .equals(idCategory)
            .where('status')
            .equals(ChallengeStatus.FULFILLED)
            .exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async queryChallengesPerformedByDate(idCategory: string, dataRef: string): Promise<IChallenge[]>{
        try {
            const dataRefNew = `${dataRef} 20:59:59.999`

            return await this.challengeModel.find()
            .where('category')
            .equals(idCategory)
            .where('status')
            .equals(ChallengeStatus.FULFILLED)
            .where('dateHourChallenge')
            .lte(momentTimezone(dataRefNew).tz('UTC').format('YYYY-MM-DD HH:mm:ss.SSS+00:00'))
            .exec()

        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }

    }
}
