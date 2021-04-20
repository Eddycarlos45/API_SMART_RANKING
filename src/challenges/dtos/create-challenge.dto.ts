import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { IPlayer } from "src/players/interfaces/player.interface";

export class CreateChallengeDTO {

    @IsNotEmpty()
    @IsDateString()
    dateHourChallenge: Date

    @IsNotEmpty()
    requester: IPlayer

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Array<IPlayer>

    category: string
}