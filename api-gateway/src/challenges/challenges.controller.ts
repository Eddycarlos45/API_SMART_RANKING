import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssignChallengeMatchDTO } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {

    constructor(private challengesService: ChallengesService){}


    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(
        @Body() createChallengeDTO: CreateChallengeDTO
    ){
        await this.challengesService.createChallenge(createChallengeDTO)
    }

    @Get()
    async getChallenges(@Query('idPlayer') idPlayer: string): Promise<any> {
        return await this.challengesService.getChallenges(idPlayer)
    }

    @Put('/:challenge')
    async updateChallenge(
        @Body(ChallengeStatusValidationPipe) updateChallengeDTO: UpdateChallengeDTO,
        @Param('challenge') _id: string 
    ){
        await this.challengesService.updateChallenge(updateChallengeDTO, _id)
    }

    @Delete('/:_id')
    async deleteChallenge(
        @Param('_id') _id: string
    ) {
      await this.challengesService.deleteChallenge(_id)
    }

    @Post('/:challenge/match/')
    async assignChallengeMatch(
        @Body(ValidationPipe) assignChallengeMatchDTO: AssignChallengeMatchDTO,
        @Param('challenge') _id: string
    ){
      this.challengesService.assignChallengeMatch(assignChallengeMatchDTO, _id)
    }
}

