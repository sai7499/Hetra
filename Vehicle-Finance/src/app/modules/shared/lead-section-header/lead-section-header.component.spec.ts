import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSectionHeaderComponent } from './lead-section-header.component';

describe('LeadSectionHeaderComponent', () => {
  let component: LeadSectionHeaderComponent;
  let fixture: ComponentFixture<LeadSectionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSectionHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
