import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlCouchbaseModule } from 'apps/utils/dynamic_modules/couchbase/module';
import { LovsModel } from './lovs.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SlCouchbaseModule.forRootAsync([
      {
        useFactory: async (configService: ConfigService) => ({
          // connectionName: 'default',
          connectionString: 'couchbase://192.168.10.101',
          username: 'administrator',
          password: 'administrator',
          bucketName: 'sl-bucket',
        }),
        inject: [ConfigService],
      },
    ]),
    SlCouchbaseModule.forFeature([LovsModel]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
