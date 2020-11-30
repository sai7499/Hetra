import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingLeadCreationComponent } from './existing-lead-creation.component';

describe('ExistingLeadCreationComponent', () => {
  let component: ExistingLeadCreationComponent;
  let fixture: ComponentFixture<ExistingLeadCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingLeadCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingLeadCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
