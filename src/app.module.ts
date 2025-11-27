import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CouchbaseModule } from './database/couchbase.database';
import { ProductsModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CouchbaseModule,
    ProductsModule,
  ],
})
export class AppModule {}