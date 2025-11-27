import { Global, Module } from '@nestjs/common';
import { Cluster, Bucket, Collection, connect, Scope } from 'couchbase';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'COUCHBASE_CLUSTER',
      useFactory: async (config: ConfigService): Promise<Cluster> => {
        const connectionString = config.get<string>('COUCHBASE_HOST');
        const username = config.get<string>('COUCHBASE_USER');
        const password = config.get<string>('COUCHBASE_PASSWORD');

        const cluster = await connect(connectionString, {
          username,
          password,
          timeouts: {
            kvTimeout: 10000,
            queryTimeout: 30000,
          },
        });

        return cluster;
      },
      inject: [ConfigService],
    },
    {
      provide: 'COUCHBASE_BUCKET',
      useFactory: async (cluster: Cluster, config: ConfigService): Promise<Bucket> => {
        const bucketName = config.get<string>('COUCHBASE_BUCKET') || 'default';
        return cluster.bucket(bucketName);
      },
      inject: ['COUCHBASE_CLUSTER', ConfigService],
    },
    {
      provide: 'COUCHBASE_SCOPE',
      useFactory: async (bucket: Bucket, config: ConfigService): Promise<Scope> => {
        const scopeName = config.get<string>('COUCHBASE_SCOPE') || '_default';
        return bucket.scope(scopeName);
      },
      inject: ['COUCHBASE_BUCKET', ConfigService],
    },

    // Collection: products
    {
      provide: 'COLLECTION_PRODUCTS',
      useFactory: (scope) => scope.collection('products'),
      inject: ['COUCHBASE_SCOPE'],
    },

    // Collection: product_variants
    {
      provide: 'COLLECTION_VARIANTS',
      useFactory: (scope) => scope.collection('product_variants'),
      inject: ['COUCHBASE_SCOPE'],
    },
  ],
  exports: ['COUCHBASE_CLUSTER', 'COUCHBASE_BUCKET', 'COUCHBASE_SCOPE', 'COLLECTION_PRODUCTS', 'COLLECTION_VARIANTS'],
})
export class CouchbaseModule {}