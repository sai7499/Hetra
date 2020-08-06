import { TestBed } from '@angular/core/testing';

import { CpcRolesService } from './cpc-roles.service';

describe('CpcRolesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CpcRolesService = TestBed.get(CpcRolesService);
    expect(service).toBeTruthy();
  });
});
