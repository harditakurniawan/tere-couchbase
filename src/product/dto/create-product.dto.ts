import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  variants: Array<CreateProductVariantDto>;
}

export class CreateProductVariantDto {
  @IsString()
  @IsOptional()
  variant_field_1: string | null;

  @IsString()
  @IsOptional()
  variant_field_2: string | null;
  
  @IsString()
  @IsOptional()
  variant_value_1: string | null;
  
  @IsString()
  @IsOptional()
  variant_value_2: string | null;
}
  