import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
  ) {}
  private readonly logger = new Logger(CategoriesService.name);

  async createCategory(category: ICategory): Promise<ICategory> {
    try {
      const createCategory = new this.categoryModel(category);
      return await createCategory.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getCategories(): Promise<ICategory[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getCategoryById(_id: string): Promise<ICategory> {
    try {
      return await this.categoryModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateCategory(_id: string, category: ICategory): Promise<void> {
    try {
      await this.categoryModel
        .findByIdAndUpdate({ _id }, { $set: category })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
