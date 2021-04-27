import { BadRequestException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/common/proxymrq/client-proxy';

@Injectable()
export class RankingsService {
    
    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking
    ){}

    private clientRankingsBackend = this.clientProxySmartRanking.getClientProxyRankingsInstance()
   
    async queryRankings(
        idCategory: string,
        dataRef: string): Promise<any>
    {
        if(!idCategory){
            throw new BadRequestException('O id da categoria é obrigatório!')
        }  

        return  await this.clientRankingsBackend.send('query-rankings',
        {idCategory: idCategory, dataRef: dataRef ? dataRef : ''}).toPromise()
    }
}
