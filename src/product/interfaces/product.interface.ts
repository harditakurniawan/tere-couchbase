import { BaseEntity } from "./base.interface";


export interface Product extends BaseEntity {
  type: 'product';
  name: string;
  description?: string;
}

export class CreateProductDto {
  name: string;
  description?: string;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
}