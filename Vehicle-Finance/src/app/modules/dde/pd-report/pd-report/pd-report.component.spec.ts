import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdReportComponent } from './pd-report.component';

describe('PdReportComponent', () => {
  let component: PdReportComponent;
  let fixture: ComponentFixture<PdReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
