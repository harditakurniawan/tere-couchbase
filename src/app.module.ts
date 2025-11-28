import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlCouchbaseModule } from 'apps/utils/dynamic_modules/couchbase/module';
import { LovsModel } from './lovs.model';
import { ProductModule } from './product/product.module';
import { ProductModel } from './product/models/product.model';
import { ProductVariantModel } from './product/models/product-variant.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SlCouchbaseModule.forRootAsync([
      {
        useFactory: async (configService: ConfigService) => ({
          // connectionName: 'default',
          connectionString: configService.get<string>('COUCHBASE_HOST'),
          username: configService.get<string>('COUCHBASE_USER'),
          password: configService.get<string>('COUCHBASE_PASSWORD'),
          bucketName: configService.get<string>('COUCHBASE_BUCKET'),
        }),
        inject: [ConfigService],
      },
    ]),
    SlCouchbaseModule.forFeature([LovsModel, ProductModel, ProductVariantModel]),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
