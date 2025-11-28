import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLovDto {
  @IsString()
  @IsNotEmpty()
  group_name: string;

  @IsString()
  @IsNotEmpty()
  set_value: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  additional: string;
}