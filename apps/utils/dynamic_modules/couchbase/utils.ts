export const DEFAULT_CONNECTION_NAME = 'default';

export const SL_COUCHBASE_CONNECTION = (name = DEFAULT_CONNECTION_NAME) =>
  `SL_COUCHBASE_CONNECTION_${name}`;

export const SL_COUCHBASE_MODEL = (
  connectionName = DEFAULT_CONNECTION_NAME,
  modelName: string,
) => `SL_COUCHBASE_MODEL_${connectionName}_${modelName}`;
