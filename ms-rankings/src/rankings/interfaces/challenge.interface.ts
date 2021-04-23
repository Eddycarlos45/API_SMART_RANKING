import { ChallengeStatus } from "./challenge-status.enum";

export interface IChallenge {
    _id: String;
    dateHourChallenge:Date;
    status: ChallengeStatus;
    dateHourOrder: Date;
    dateHourAnswer: Date;
    requester: string;
    category: string;
    players: string[];
    match?: string
}