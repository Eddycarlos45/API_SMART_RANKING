import { Document } from 'mongoose';
import { ICategory } from 'src/categories/interfaces/category.interface';
export interface IPlayer extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  name: string;
  category: ICategory;
  ranking: string;
  rankingPosition: number;
  urlPhotoPlayer: string;
}
