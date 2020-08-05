import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiReportResidenceComponent } from './fi-report-residence.component';

describe('FiReportResidenceComponent', () => {
  let component: FiReportResidenceComponent;
  let fixture: ComponentFixture<FiReportResidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiReportResidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiReportResidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
