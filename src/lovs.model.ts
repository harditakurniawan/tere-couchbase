import { SlCouchbaseModel } from 'apps/utils/dynamic_modules/couchbase/decorator';

export const LovsSchemaDef = {
  group_name: { type: String, required: true },
  set_value: { type: Object, required: true },
  description: { type: Object },
  additional: { type: Object },
  // created_at: { type: Date, default: () => new Date() },
  // updated_at: { type: Date, default: () => new Date() },
  // deleted_at: { type: Date },
};

@SlCouchbaseModel({
  // scope: '', // TODO
  collection: 'lovs', // TODO
  schema: { definition: LovsSchemaDef, opts: { timestamps: true } },
})
export class LovsModel {}
