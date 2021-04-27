import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/common/proxymrq/client-proxy';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';
import { AssignChallengeMatchDTO } from './dtos/assign-challenge-match.dto';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { IMatch } from './interfaces/match.interface';

@Injectable()
export class ChallengesService {

    constructor(private clientProxySmartRanking: ClientProxySmartRanking){}

    private readonly logger  = new Logger(ChallengesService.name)

    private clientChallenges = this.clientProxySmartRanking.getClientProxyChallengeInstance()

    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    async createChallenge(
        createChallengeDTO: CreateChallengeDTO
    ){
        this.logger.log(`createChallengeDTO: ${JSON.stringify(createChallengeDTO)}`)

        const players: IPlayer[] = await this.clientAdminBackend.send('get-players','').toPromise()

        createChallengeDTO.players.map(playerDto => {
            const playerFilter: IPlayer[] = players.filter( player => player._id === playerDto._id)

            this.logger.log(`playerFilter: ${JSON.stringify(playerFilter)}`)

            if(playerFilter.length === 0) {
                throw new BadRequestException(`O id ${playerDto._id} não é um jogador!`)
            }

            if(playerFilter[0].category !== createChallengeDTO.category) {
                throw new BadRequestException(`O jogador ${playerFilter[0]._id} não faz parte da categoria informada`)
            }
        })

        const requesterIsMatchPlayer: IPlayer[] = createChallengeDTO.players.filter(player => player._id)

        this.logger.log(`requesterIsMatchPlayer: ${JSON.stringify(requesterIsMatchPlayer)}`)

        if(requesterIsMatchPlayer.length === 0) {
            throw new BadRequestException(`O solicitante deve ser um jogador da partida!`)
        }

        const category = await this.clientAdminBackend.send('get-categories', createChallengeDTO.category).toPromise()

        this.logger.log(`category: ${JSON.stringify(category)}`)

        if(!category){
            throw new BadRequestException(`Categoria informada não existe!`)
        }
        await this.clientChallenges.emit('create-challenge', createChallengeDTO)
    }

    async getChallenges(idPlayer: string): Promise<any> {
        if(idPlayer){
            const player: IPlayer = await this.clientAdminBackend.send('get-players', idPlayer).toPromise()
            this.logger.log(`player: ${JSON.stringify(player)}`)
            if(!player){
                throw new BadRequestException(`Jogador não cadastrado`)
            }
        }
        return this.clientChallenges.send('get-challenges', {idPlayer: idPlayer, _id: ''}).toPromise()

    }

    async updateChallenge(
        updateChallengeDTO: UpdateChallengeDTO,
        _id: string 
    ){
        const challenge: IChallenge = await this.clientChallenges.send('get-challenges', {idPlayer:'', _id: _id}).toPromise()
        this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

        if(!challenge){
            throw new BadRequestException(`Desafio não cadastrado!`)
        }
        
        if(challenge.status !== ChallengeStatus.PENDING) {
            throw new BadRequestException('Somente desafios com status PENDENTE podem ser atualizados!')
        }
        
        await this.clientChallenges.emit('update-challenge', {id: _id, challenge: updateChallengeDTO})
    }

    async deleteChallenge(
         _id: string
    ) {
        const challenge: IChallenge = await this.clientChallenges.send('get-challenges', {idPlayer: '', _id: _id}).toPromise()
        
        this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

        if(!challenge){
            throw new BadRequestException(`Desafio não cadastrado!`)
        }
        await this.clientChallenges.emit('delete-challenge', challenge)
    }

    async assignChallengeMatch(
        assignChallengeMatchDTO: AssignChallengeMatchDTO,
        _id: string
    ){
        const challenge: IChallenge = await this.clientChallenges.send('get-challenges', {idPlayer: '', _id: _id}).toPromise()
        this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

        if(!challenge){
            throw new BadRequestException(`Desafio não encontrado!`)
        }

        if(challenge.status == ChallengeStatus.FULFILLED){
            throw new BadRequestException(`Desafio já realizado!`)
        }

        if(challenge.status !== ChallengeStatus.ACCEPT){
            throw new BadRequestException(`Partidas somente podem ser lançadas em desafios aceitos pelos adversários`)
        }

        if(!challenge.players.includes(assignChallengeMatchDTO.def)){
            throw new BadRequestException(`O jogador vencedor da partida deve fazer parte do desafio!`)
        }

        const match: IMatch = {}
        match.category = challenge.category
        match.def = assignChallengeMatchDTO.def
        match.challenge = _id
        match.players = challenge.players
        match.result = assignChallengeMatchDTO.result

        await this.clientChallenges.emit('create-match', match)
    }
}
