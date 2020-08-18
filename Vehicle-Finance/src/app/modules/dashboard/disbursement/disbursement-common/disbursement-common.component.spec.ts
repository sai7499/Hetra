import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementCommonComponent } from './disbursement-common.component';

describe('DisbursementCommonComponent', () => {
  let component: DisbursementCommonComponent;
  let fixture: ComponentFixture<DisbursementCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
