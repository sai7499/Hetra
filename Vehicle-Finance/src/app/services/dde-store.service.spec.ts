import { TestBed } from '@angular/core/testing';

import { DdeStoreService } from './dde-store.service';

describe('DdeStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DdeStoreService = TestBed.get(DdeStoreService);
    expect(service).toBeTruthy();
  });
});
