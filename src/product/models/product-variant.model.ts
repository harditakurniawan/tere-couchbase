import { SlCouchbaseModel } from 'apps/utils/dynamic_modules/couchbase/decorator';

export const VariantSchema = {
  product_id: { type: String },
  variant_field_1: { type: String },
  variant_field_2: { type: String },
  variant_value_1: { type: String },
  variant_value_2: { type: String },
};

@SlCouchbaseModel({
  scope: 'slrevamp',
  collection: 'product_variants',
  schema: { definition: VariantSchema, opts: { timestamps: true } },
})
export class ProductVariantModel {}
