import { Document } from 'mongoose';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { Tracing } from 'trace_events';

export interface ICategory extends Document {
  readonly category: string;
  description: string;
  event: Array<Event>;
  players: Array<IPlayer>;
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
