import { Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/common/proxymrq/client-proxy';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();


  createCategory(createCategoryDTO: CreateCategoryDTO) {
    this.clientAdminBackend.emit('create-category', createCategoryDTO);
  }

  async getCategories(_id: string): Promise<any> {
    return  await this.clientAdminBackend.send('get-categories', _id ? _id : '').toPromise();
  }

  updateCategory(
    updateCategoryDTO: UpdateCategoryDTO,
    _id: string,
  ) {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: updateCategoryDTO,
    });
  }
}
