import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanBookingComponent } from './loan-booking.component';

describe('LoanBookingComponent', () => {
  let component: LoanBookingComponent;
  let fixture: ComponentFixture<LoanBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
