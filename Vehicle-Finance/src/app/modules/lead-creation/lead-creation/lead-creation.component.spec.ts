import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCreationComponent } from './lead-creation.component';

describe('LeadCreationComponent', () => {
  let component: LeadCreationComponent;
  let fixture: ComponentFixture<LeadCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
