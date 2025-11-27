import { BaseEntity } from "./base.interface";

export interface ProductVariant extends BaseEntity {
  type: 'product_variant';
  product_id: string;
  variant_field_1?: string;
  variant_field_2?: string;
  variant_value_1?: string;
  variant_value_2?: string;
}

export class CreateVariantDto {
  product_id: string;
  variant_field_1?: string;
  variant_field_2?: string;
  variant_value_1?: string;
  variant_value_2?: string;
}

export class UpdateVariantDto {
  variant_field_1?: string;
  variant_field_2?: string;
  variant_value_1?: string;
  variant_value_2?: string;
}