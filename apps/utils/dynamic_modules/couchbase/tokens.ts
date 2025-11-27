export const CONNECTION_TOKEN = (name = 'default') =>
  `SL_COUCHBASE_CONNECTION_${name}`;

export const CONFIG_TOKEN = (name = 'default') => `SL_COUCHBASE_CONFIG_${name}`;

export const MODEL_TOKEN = (conn: string, name: string) =>
  `SL_COUCHBASE_MODEL_${conn}_${name}`;
