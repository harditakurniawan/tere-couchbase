// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from './interfaces/product.interface';
import {
  CreateVariantDto,
  UpdateVariantDto,
} from './interfaces/product-variant.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.softDelete(id);
  }

  // Variants
  @Post(':productId/variants')
  createVariant(@Param('productId') productId: string, @Body() dto: CreateVariantDto) {
    dto.product_id = productId;
    return this.productsService.createVariant(dto);
  }

  @Get(':productId/variants')
  getVariants(@Param('productId') productId: string) {
    return this.productsService.getVariantsByProduct(productId);
  }

  @Patch('variants/:variantId')
  updateVariant(@Param('variantId') variantId: string, @Body() dto: UpdateVariantDto) {
    return this.productsService.updateVariant(variantId, dto);
  }

  @Delete('variants/:variantId')
  deleteVariant(@Param('variantId') variantId: string) {
    return this.productsService.deleteVariant(variantId);
  }
}