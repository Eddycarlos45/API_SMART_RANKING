import { IPlayer } from "src/players/interfaces/player.interface";
import { ChallengeStatus } from "../challenge-status.enum";

export interface IChallenge extends Document{
    dateHourChallenge:Date;
    status: ChallengeStatus;
    dateHourOrder: Date;
    dateHourAnswer: Date;
    requester: IPlayer;
    category: string;
    players: Array<IPlayer>;
    match?: string;
}
