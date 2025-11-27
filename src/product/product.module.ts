import { Module } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { CouchbaseModule } from '../database/couchbase.database';

@Module({
  imports: [CouchbaseModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}