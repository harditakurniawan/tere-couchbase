import 'reflect-metadata';

export interface SlCouchbaseSchemaField {
  type: any;
  required?: boolean;
}

export interface SlCouchbaseSchema {
  [key: string]: SlCouchbaseSchemaField;
}

export interface SlCouchbaseModelOptions {
  scope?: string;
  collection?: string;
  schema: SlCouchbaseSchema;
}

export const SL_COUCHBASE_MODEL_METADATA = 'SL_COUCHBASE_MODEL_METADATA';

export function SlCouchbaseModel(
  options: SlCouchbaseModelOptions & { schema: SlCouchbaseSchema },
) {
  return (target: any) => {
    Reflect.defineMetadata(SL_COUCHBASE_MODEL_METADATA, options, target);
  };
}
