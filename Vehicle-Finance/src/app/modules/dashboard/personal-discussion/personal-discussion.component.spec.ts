import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDiscussionComponent } from './personal-discussion.component';

describe('PersonalDiscussionComponent', () => {
  let component: PersonalDiscussionComponent;
  let fixture: ComponentFixture<PersonalDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
