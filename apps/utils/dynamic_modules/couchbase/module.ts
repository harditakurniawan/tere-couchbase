// cb.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { Cluster, connect } from 'couchbase';
import { SL_COUCHBASE_MODEL_METADATA } from './decorator';
import { SlCouchbaseRepository } from './repository';

export interface SlCouchbaseConnectionOptions {
  connectionName?: string;
  connectionString: string;
  bucketName: string;
  username: string;
  password: string;
}

const CONNECTION_TOKEN = (name: string) => `SL_COUCHBASE_CONNECTION_${name}`;
const MODEL_TOKEN = (name: string) => `SL_COUCHBASE_MODEL_${name}`;
const CONFIG_TOKEN = (name: string) => `SL_COUCHBASE_CONFIG_${name}`;

@Global()
@Module({})
export class SlCouchbaseModule {
  static forRootAsync(
    optionsArray: {
      name?: string;
      useFactory: (
        ...args: any[]
      ) => Promise<SlCouchbaseConnectionOptions> | SlCouchbaseConnectionOptions;
      inject?: any[];
    }[],
  ): DynamicModule {
    const providers = optionsArray.flatMap((opt) => {
      const name = opt.name || 'default';

      // store connection config
      const configProvider = {
        provide: CONFIG_TOKEN(name),
        useFactory: opt.useFactory,
        inject: opt.inject || [],
      };

      // cluster provider
      const connectionProvider = {
        provide: CONNECTION_TOKEN(name),
        useFactory: async (config: SlCouchbaseConnectionOptions) => {
          const cluster = await connect(config.connectionString, {
            username: config.username,
            password: config.password,
          });
          return cluster;
        },
        inject: [CONFIG_TOKEN(name)],
      };

      return [configProvider, connectionProvider];
    });

    return {
      module: SlCouchbaseModule,
      providers,
      exports: providers,
    };
  }

  static forFeature(models: any[], connectionName = 'default'): DynamicModule {
    const providers = models.map((model) => {
      const meta = Reflect.getMetadata(SL_COUCHBASE_MODEL_METADATA, model);
      if (!meta) {
        throw new Error(`Model missing @SlCouchbaseModel(): ${model.name}`);
      }

      return {
        provide: MODEL_TOKEN(model.name),
        useFactory: (cluster: Cluster, config: SlCouchbaseConnectionOptions) =>
          new SlCouchbaseRepository(
            cluster,
            config.bucketName,
            meta.scope || '_default',
            meta.collection || '_default',
          ),
        inject: [
          CONNECTION_TOKEN(connectionName),
          CONFIG_TOKEN(connectionName),
        ],
      };
    });

    return {
      module: SlCouchbaseModule,
      providers,
      exports: providers,
    };
  }
}
