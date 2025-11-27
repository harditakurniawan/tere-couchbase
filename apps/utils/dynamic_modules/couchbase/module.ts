import { DynamicModule, Global, Module } from '@nestjs/common';
import { Cluster, connect } from 'couchbase';
import { SL_COUCHBASE_MODEL_METADATA } from './decorator';
import { SlCouchbaseRepository } from './repository';
import { SlCouchbaseSchema } from './schema';
import { SlCouchbaseConnectionOptions } from './interface';
import { CONNECTION_TOKEN, CONFIG_TOKEN, MODEL_TOKEN } from './tokens';

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
      const configToken = CONFIG_TOKEN(name);
      const connToken = CONNECTION_TOKEN(name);

      const configProvider = {
        provide: configToken,
        useFactory: opt.useFactory,
        inject: opt.inject || [],
      };

      const connectionProvider = {
        provide: connToken,
        useFactory: async (config: SlCouchbaseConnectionOptions) => {
          console.log('Couchbase config:', config);

          const cluster = await connect(config.connectionString, {
            username: config.username,
            password: config.password,
          });

          return cluster as Cluster;
        },
        inject: [configToken],
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
      if (!meta)
        throw new Error(`Model missing @SlCouchbaseModel(): ${model.name}`);

      const schemaInstance = meta.schema
        ? new SlCouchbaseSchema(
            meta.schema.definition || meta.schema,
            meta.schema.opts,
          )
        : undefined;

      console.log('Model injected: ', model.name);

      return {
        provide: MODEL_TOKEN(connectionName, model.name),
        useFactory: (cluster: Cluster, config: SlCouchbaseConnectionOptions) =>
          new SlCouchbaseRepository(
            cluster,
            config.bucketName,
            meta.scope || '_default',
            meta.collection,
            schemaInstance,
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
