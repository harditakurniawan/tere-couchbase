import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectCouchbaseModel } from 'apps/utils/dynamic_modules/couchbase/decorator';
import { ProductModel } from './models/product.model';
import { SlCouchbaseRepository } from 'apps/utils/dynamic_modules/couchbase/repository';
import { ProductVariantModel } from './models/product-variant.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectCouchbaseModel(ProductModel.name)
    private readonly productModel: SlCouchbaseRepository<ProductModel>,

    @InjectCouchbaseModel(ProductVariantModel.name)
    private readonly productVariantModel: SlCouchbaseRepository<ProductVariantModel>,
  ) {}

  public async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productModel.create({
        name: createProductDto.name,
        description: createProductDto.description,
      });
      
      for (const variant of createProductDto.variants) {
        await this.productVariantModel.create({
          product_id: product.id,
          variant_field_1: variant.variant_field_1,
          variant_field_2: variant.variant_field_2,
          variant_value_1: variant.variant_value_1,
          variant_value_2: variant.variant_value_2,
        });
      }

      return product
    } catch (error) {
      console.log('ERROR CREATE PRODUCT', error);
      
      throw new InternalServerErrorException(error.message)
    }
  }

  public async findAllProductWithVariants() {
    try {
      const query = `
        SELECT 
        META(p).id AS product_id,
        p.*,
        (SELECT pv.* FROM slrevamp2.slrevamp.product_variants pv WHERE pv.product_id = META(p).id ORDER BY META(pv).id ASC) AS variants
        FROM slrevamp2.slrevamp.products p ORDER BY META(p).id ASC;
      `;
      
      const result = await this.productModel.aggregate(query);

      return result.rows;
    } catch (error) {
      console.log('ERROR FIND ALL PRODUCT WITH VARIANTS', error);
      
      throw new InternalServerErrorException(error.message)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
