import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementSectionComponent } from './disbursement-section.component';

describe('DisbursementSectionComponent', () => {
  let component: DisbursementSectionComponent;
  let fixture: ComponentFixture<DisbursementSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
