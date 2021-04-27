import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {

  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    this.categoriesService.createCategory(createCategoryDTO);
  }

  @Get()
  async getCategories(@Query('idCategory') _id: string) {
    return  await this.categoriesService.getCategories(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('_id') _id: string,
  ) {
    this.categoriesService.updateCategory(
    updateCategoryDTO,
    _id
    );
  }
}
