export interface ICategory {
    readonly _id: string;
    readonly category: string;
    description: string;
    events: Array<IEvents>;
}

interface IEvents {
    name: string;
    operation: string;
    value: number;
}