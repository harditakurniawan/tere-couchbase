import { SlCouchbaseModel } from 'apps/utils/dynamic_modules/couchbase/decorator';
// import { Schema } from 'ottoman';

// export const LovsModel = {
//   name: 'lovs',
//   schema: new Schema({
//     group_name: String,
//     set_value: Schema.Types.Mixed, // any
//     description: String,
//     additional: Schema.Types.Mixed, // any
//     created_by: Schema.Types.Mixed, // any
//     created_at: { type: Date, default: () => new Date() },
//     updated_at: { type: Date, default: () => new Date() },
//     deleted_at: { type: Date, default: () => new Date() },
//   }),
// };

@SlCouchbaseModel({
  collection: 'lovs',
  schema: {
    group_name: { type: String, required: true },
    set_value: { type: String, required: true },
    description: { type: String },
  },
})
export class LovsModel {}
