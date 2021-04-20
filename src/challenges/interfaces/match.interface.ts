import {IPlayer} from '../../players/interfaces/player.interface'

export interface IMatch {
    category?: string;
    challenge?: string;
    players?: IPlayer[];
    def?: IPlayer;
    result?: Array<IResult>;
}

export interface IResult {
    set?: string
}