// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Collection, GetResult } from 'couchbase';
import { v4 as uuidv4 } from 'uuid';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from './interfaces/product.interface';
import {
  ProductVariant,
  CreateVariantDto,
  UpdateVariantDto,
} from './interfaces/product-variant.interface';
import { CouchbaseModule } from '../database/couchbase.database';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('COLLECTION_PRODUCTS') private productColl: Collection,
    @Inject('COLLECTION_VARIANTS') private variantColl: Collection,
  ) {}

  private now() {
    return new Date().toISOString();
  }

  // ===================== PRODUCT =====================
  async create(dto: CreateProductDto): Promise<Product> {
    const id = `${uuidv4()}`;
    const doc: Product = {
      id,
      type: 'product',
      name: dto.name,
      description: dto.description,
      created_at: this.now(),
      updated_at: this.now(),
    };
    await this.productColl.insert(id, doc);
    return doc;
  }

  async findAll(): Promise<Product[]> {
    try {
      const qs = `SELECT META().id, * FROM products WHERE type = 'product'`;
      const result = await this.productColl.scope.query(qs);
      console.log('result', result);
      
      return result.rows.map(r => r.products as Product);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  // async findOne(id: string): Promise<Product> {
  async findOne(id: string): Promise<any> {
    try {
      // const result: GetResult = await this.productColl.get(id);
      // const doc = result.content as Product;
      // if (doc.deleted_at) throw new NotFoundException();
      // return doc;

      const query = `
        SELECT 
            p.*, 
            pv.* 
        FROM slrevamp2.slrevamp.products p 
        LEFT JOIN slrevamp2.slrevamp.product_variants pv ON p.id = pv.product_id
        WHERE p.id = $1
      `;

      const result = await this.productColl.scope.query(query, {
        parameters: [id],
      });
      console.log('RESULT', result.rows);
      

      if (result.rows.length === 0) {
        throw new NotFoundException('Product not found');
      }

      const row = result.rows[0];

      return row
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 13) {
        throw new NotFoundException('Product not found');
      }
      console.log('ERROR', err);
      
      throw err;
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const result = await this.productColl.get(id);
    const doc = result.content as Product;

    if (doc.deleted_at) throw new NotFoundException();

    const updated = { ...doc, ...dto, updated_at: this.now() };
    await this.productColl.replace(id, updated);
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.productColl.get(id);
    const doc = result.content as Product;
    await this.productColl.replace(id, { ...doc, deleted_at: this.now(), updated_at: this.now() });
  }

  // ===================== VARIANT =====================
  async createVariant(dto: CreateVariantDto): Promise<ProductVariant> {
    // Validasi product exists
    await this.findOne(dto.product_id);

    const id = `variant::${uuidv4()}`;
    const doc: ProductVariant = {
      id,
      type: 'product_variant',
      product_id: dto.product_id,
      variant_field_1: dto.variant_field_1,
      variant_field_2: dto.variant_field_2,
      variant_value_1: dto.variant_value_1,
      variant_value_2: dto.variant_value_2,
      created_at: this.now(),
      updated_at: this.now(),
    };

    await this.variantColl.insert(id, doc);
    return doc;
  }

  async getVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    // Pastikan product exists dulu
    await this.findOne(productId);

    const qs = `
      SELECT META().id, *
      FROM product_variants
      WHERE product_id = $1 AND deleted_at IS NULL
    `;
    const result = await this.variantColl.scope.query(qs, { parameters: [productId] });
    return result.rows.map(r => r.product_variants as ProductVariant);
  }

  async updateVariant(variantId: string, dto: UpdateVariantDto): Promise<ProductVariant> {
    const result = await this.variantColl.get(variantId);
    const doc = result.content as ProductVariant;

    if (doc.deleted_at) throw new NotFoundException();

    const updated = { ...doc, ...dto, updated_at: this.now() };
    await this.variantColl.replace(variantId, updated);
    return updated;
  }

  async deleteVariant(variantId: string): Promise<void> {
    const result = await this.variantColl.get(variantId);
    const doc = result.content as ProductVariant;
    await this.variantColl.replace(variantId, {
      ...doc,
      deleted_at: this.now(),
      updated_at: this.now(),
    });
  }
}