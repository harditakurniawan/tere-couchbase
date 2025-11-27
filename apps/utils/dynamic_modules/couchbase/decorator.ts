import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { MODEL_TOKEN } from './tokens';

export const SL_COUCHBASE_MODEL_METADATA = 'SL_COUCHBASE_MODEL_METADATA';

export interface SlCouchbaseModelOptions {
  scope?: string; // default: _default
  collection?: string; // default: _default
  schema?: any;
}

export function SlCouchbaseModel(options: SlCouchbaseModelOptions) {
  return function (target: any) {
    Reflect.defineMetadata(SL_COUCHBASE_MODEL_METADATA, options, target);
  };
}

export function InjectCouchbaseModel(
  modelName: string,
  connectionName = 'default',
) {
  return Inject(MODEL_TOKEN(connectionName, modelName));
}
