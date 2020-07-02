import { TestBed } from '@angular/core/testing';

import { PersonalDiscussionService } from './personal-discussion.service';

describe('PersonalDiscussionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonalDiscussionService = TestBed.get(PersonalDiscussionService);
    expect(service).toBeTruthy();
  });
});
