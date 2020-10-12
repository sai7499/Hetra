import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTestComponent } from './loan-test.component';

describe('LoanTestComponent', () => {
  let component: LoanTestComponent;
  let fixture: ComponentFixture<LoanTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
