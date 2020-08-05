import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiReportOfficeComponent } from './fi-report-office.component';

describe('FiReportOfficeComponent', () => {
  let component: FiReportOfficeComponent;
  let fixture: ComponentFixture<FiReportOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiReportOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiReportOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
