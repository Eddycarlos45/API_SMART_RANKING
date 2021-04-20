import { IsOptional } from "class-validator";
import { ChallengeStatus } from "../challenge-status.enum";

export class UpdateChallengeDTO {

    @IsOptional()
    status: ChallengeStatus
}