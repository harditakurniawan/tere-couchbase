import { Cluster } from 'couchbase';

export class SlCouchbaseRepository<T> {
  private collection: any;

  constructor(
    private cluster: Cluster,
    private bucketName: string,
    private scopeName: string,
    private collectionName: string,
  ) {
    const bucket = cluster.bucket(bucketName);
    const scope = scopeName ? bucket.scope(scopeName) : bucket.defaultScope();
    this.collection = scope.collection(collectionName);
  }

  async create(id: string, data: Partial<T>) {
    await this.collection.insert(id, data);
    return { id, ...data };
  }

  async findById(id: string) {
    const res = await this.collection.get(id);
    return res?.value;
  }

  async find(filter: Record<string, any>) {
    if (!Object.keys(filter).length) filter = {};

    const where =
      Object.entries(filter)
        .map(([k, v]) => `\`${k}\` = "${v}"`)
        .join(' AND ') || '1=1';

    const query = `
      SELECT *
      FROM \`${this.bucketName}\`.\`${this.scopeName || '_default'}\`.\`${
      this.collectionName || '_default'
    }\`
      WHERE ${where};
    `;

    const result = await this.cluster.query(query);
    return result.rows;
  }

  async update(id: string, data: Partial<T>) {
    await this.collection.upsert(id, data);
    return this.findById(id);
  }

  async remove(id: string) {
    await this.collection.remove(id);
    return true;
  }
}
