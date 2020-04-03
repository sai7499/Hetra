import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDdeComponent } from './loan-dde.component';

describe('LoanDdeComponent', () => {
  let component: LoanDdeComponent;
  let fixture: ComponentFixture<LoanDdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
