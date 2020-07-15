import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiReportComponent } from './fi-report.component';

describe('FiReportComponent', () => {
  let component: FiReportComponent;
  let fixture: ComponentFixture<FiReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
