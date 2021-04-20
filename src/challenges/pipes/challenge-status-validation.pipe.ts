import { BadRequestException, PipeTransform } from "@nestjs/common";
import {ChallengeStatus} from '../challenge-status.enum'
export class ChallengeStatusValidationPipe implements PipeTransform {
    readonly acceptedStatuses = [
        ChallengeStatus.ACCEPT,
        ChallengeStatus.DENIED,
        ChallengeStatus.CANCELED
    ]

    transform(value: any) {
        const status = value.status.toUpperCase();

        if(!this.validStatus(status)){
            throw new BadRequestException(`${status} é um status inválido`)
        }
        return value;
    }

    private validStatus(status: any){
        const idx = this.acceptedStatuses.indexOf(status);
        // -1 se o elemento não for encontrado
        return idx !== -1;
    }
}