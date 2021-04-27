import { ChallengeStatus } from "../challenge-status.enum";

export interface IChallenge extends Document{
    dateHourChallenge:Date;
    status: ChallengeStatus;
    dateHourOrder: Date;
    dateHourAnswer: Date;
    requester: string;
    category: string;
    players: string[];
    match?: string
}