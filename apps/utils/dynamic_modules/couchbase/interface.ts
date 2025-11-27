// import { Schema } from 'ottoman';

export interface SlCouchbaseConnectionOptions {
  name?: string; // optional, default = 'default'
  connectionString: string;
  bucketName: string;
  scopeName?: string;
  collectionName?: string;
  username?: string;
  password?: string;
}

// export type SlCouchbaseModelDefinition = {
//   name: string;
//   schema: Schema;
// };
