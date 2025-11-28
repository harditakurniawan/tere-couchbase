import { SlCouchbaseModel } from 'apps/utils/dynamic_modules/couchbase/decorator';

export const ProductSchema = {
  name: { type: String, required: true },
  description: { type: String },
};

@SlCouchbaseModel({
  scope: 'slrevamp',
  collection: 'products',
  schema: { definition: ProductSchema, opts: { timestamps: true } },
})
export class ProductModel {}
