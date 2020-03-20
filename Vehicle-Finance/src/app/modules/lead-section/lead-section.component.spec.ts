import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSectionComponent } from './lead-section.component';

describe('LeadSectionComponent', () => {
  let component: LeadSectionComponent;
  let fixture: ComponentFixture<LeadSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
