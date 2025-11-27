export interface BaseDocument {
  id?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export type SchemaField = {
  type: any;
  required?: boolean;
  default?: any;
};

export type SchemaDefinition = Record<string, SchemaField>;

export class SlCouchbaseSchema {
  constructor(
    public readonly definition: SchemaDefinition,
    public opts: { timestamps?: boolean } = {},
  ) {}

  applyDefaults<T extends BaseDocument & Record<string, any>>(doc: T): T {
    for (const [k, def] of Object.entries(this.definition)) {
      if (doc[k] === undefined && def.default !== undefined) {
        (doc as any)[k] =
          typeof def.default === 'function' ? def.default() : def.default;
      }
    }

    if (this.opts.timestamps) {
      const now = new Date().toISOString();
      if (!doc.createdAt) doc.createdAt = now;
      doc.updatedAt = now;
    }

    return doc;
  }

  touchUpdatedAt<T extends BaseDocument & Record<string, any>>(doc: T): T {
    if (this.opts.timestamps) {
      doc.updatedAt = new Date().toISOString();
    }
    return doc;
  }

  validate<T extends BaseDocument & Record<string, any>>(doc: T) {
    for (const [k, def] of Object.entries(this.definition)) {
      if (def.required && (doc[k] === undefined || doc[k] === null)) {
        throw new Error(`Validation failed: ${k} is required`);
      }

      if (doc[k] !== undefined && def.type && typeof def.type === 'function') {
        const expected = def.type.name.toLowerCase();
        const actual = typeof doc[k];

        if (!['object', 'function'].includes(expected) && expected !== actual) {
          if (!(def.type === Date && typeof doc[k] === 'string')) {
            throw new Error(
              `Validation failed: ${k} expected ${def.type.name} but got ${actual}`,
            );
          }
        }
      }
    }
  }
}
