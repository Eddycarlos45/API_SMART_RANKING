import { Controller, Get, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
    constructor(
        private rankingsService: RankingsService
    ){}

    @Get()
    async queryRankings(
        @Query('idCategory') idCategory: string,
        @Query('dataRef') dataRef: string): Promise<any>
    {
       return await this.queryRankings(idCategory, dataRef)
    }
}
