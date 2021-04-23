export interface IRankingResponse {

    player?: string
    position?: number
    score?: number
    matchhistoric?: IHistoric
}

export interface IHistoric {
    victories?: number
    defeats?: number
}