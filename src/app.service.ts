import { Injectable } from '@nestjs/common';
import { InjectCouchbaseModel } from 'apps/utils/dynamic_modules/couchbase/decorator';
import { LovsModel } from './lovs.model';
import { SlCouchbaseRepository } from 'apps/utils/dynamic_modules/couchbase/repository';

@Injectable()
export class AppService {
  constructor(
    @InjectCouchbaseModel(LovsModel.name)
    private readonly lovsModel: SlCouchbaseRepository<LovsModel>,
  ) {}

  create(dto: any) {
    return this.lovsModel.create(dto);
  }

  findAll() {
    return this.lovsModel.find({});
  }

  findById(id: string) {
    return this.lovsModel.findOneById(id);
  }

  update(id: string, patch: any) {
    return this.lovsModel.update(id, patch);
  }

  delete(id: string) {
    return this.lovsModel.delete(id);
  }
}
