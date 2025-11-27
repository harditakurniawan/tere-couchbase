import { Cluster, Collection, QueryResult } from 'couchbase';
import { v4 as uuidv4 } from 'uuid';
import { BaseDocument, SlCouchbaseSchema } from './schema';

export class SlCouchbaseRepository<T extends BaseDocument> {
  private collection: Collection;
  private scopeName: string;
  private collectionName: string;
  private bucketName: string;
  private schema?: SlCouchbaseSchema;
  private typeName?: string;

  constructor(
    private readonly cluster: Cluster,
    bucketName: string,
    scopeName: string,
    collectionName: string,
    schema?: SlCouchbaseSchema,
    typeName?: string,
  ) {
    this.bucketName = bucketName;
    this.scopeName = scopeName || '_default';
    this.collectionName = collectionName || '_default';
    this.schema = schema;
    this.typeName = typeName || null;

    const bucket = cluster.bucket(bucketName);
    const scope = scopeName ? bucket.scope(scopeName) : bucket.defaultScope();

    this.collection = scope.collection(collectionName);
  }

  /**
   * create new document
   */
  async create(data: Partial<T>, id?: string) {
    const doc: any = { ...data };

    if (this.typeName && !doc._type) {
      doc._type = this.typeName;
    }

    if (this.schema) this.schema.applyDefaults(doc);
    if (!id) id = uuidv4();
    if (this.schema) this.schema.validate(doc);

    await this.collection.insert(id, doc);

    return { id, ...doc };
  }

  /**
   * find document by id
   */
  async findOneById(id: string) {
    try {
      const res = await this.collection.get(id);
      return res.value;
    } catch (err: any) {
      if (err?.message?.includes('document not found')) return null;
      throw err;
    }
  }

  /**
   * find by filter
   */
  async find(filter: Record<string, any> = {}, options: any = {}) {
    if (this.typeName) {
      filter._type = this.typeName;
    }

    const whereClause = this.buildWhereClause(filter);

    const sort = options.sort ? `ORDER BY ${options.sort}` : '';
    const limit = options.limit ? `LIMIT ${options.limit}` : '';
    const offset = options.offset ? `OFFSET ${options.offset}` : '';
    const query = `
      SELECT META().id as _id, ${this.collectionName}.*
      FROM \`${this.bucketName}\`.\`${this.scopeName}\`.\`${this.collectionName}\` AS ${this.collectionName}
      ${whereClause}
      ${sort}
      ${limit}
      ${offset};
    `;
    const opts = options.consistency
      ? { scanConsistency: <any>options.consistency }
      : {};

    const result: QueryResult = await this.cluster.query(query, opts);
    return result.rows;
  }

  /**
   * where clause builder
   */
  private buildWhereClause(filter: Record<string, any>) {
    if (!filter || Object.keys(filter).length === 0) return '';

    const parts = Object.entries(filter).map(([k, v]) => {
      if (v === null) return `\`${k}\` IS NULL`;
      if (typeof v === 'string')
        return `\`${k}\` = "${v.replace(/"/g, '\\"')}"`;
      if (typeof v === 'boolean' || typeof v === 'number')
        return `\`${k}\` = ${v}`;

      // array (in)
      if (Array.isArray(v)) {
        const vals = v
          .map((x) =>
            typeof x === 'string' ? `"${x.replace(/"/g, '\\"')}"` : x,
          )
          .join(',');
        return `\`${k}\` IN [${vals}]`;
      }

      // object: basic comparison operators like { $gt: 10 }, { &lt: 2 }, dll
      if (typeof v === 'object') {
        const clauses = [];
        for (const [op, val] of Object.entries(v)) {
          switch (op) {
            case '$gt':
              clauses.push(`\`${k}\` > ${val}`);
              break;
            case '$lt':
              clauses.push(`\`${k}\` < ${val}`);
              break;
            case '$gte':
              clauses.push(`\`${k}\` >= ${val}`);
              break;
            case '$lte':
              clauses.push(`\`${k}\` <= ${val}`);
              break;
            case '$ne':
              clauses.push(`\`${k}\` != ${val}`);
              break;
            default:
              break;
          }
        }

        return clauses.join(' AND ');
      }

      // fallback to JSON comparison (slow)
      return `\`${k}\` = ${JSON.stringify(v)}`;
    });

    return 'WHERE ' + parts.join(' AND ');
  }

  /**
   * update existing document
   */
  async update(id: string, patch: Partial<T>) {
    const existing = await this.findOneById(id);
    if (!existing) throw new Error('Document not found');

    const merged = { ...existing, ...patch };

    if (this.typeName) {
      merged._type = existing._type || this.typeName;
    }

    if (this.schema) this.schema.touchUpdatedAt(merged);
    if (this.schema) this.schema.validate(merged);

    await this.collection.upsert(id, merged);

    return merged;
  }

  /**
   * delete document
   */
  async delete(id: string) {
    await this.collection.remove(id);
    return true;
  }

  /**
   * count document by filter
   */
  async count(filter: Record<string, any> = {}) {
    if (this.typeName) {
      filter._type = this.typeName;
    }

    const where = this.buildWhereClause(filter);
    const q = `SELECT COUNT(1) AS total FROM \`${this.bucketName}\`.\`${this.scopeName}\`.\`${this.collectionName}\` ${where};`;
    const r = await this.cluster.query(q);

    return r.rows[0]?.total ?? 0;
  }
}
