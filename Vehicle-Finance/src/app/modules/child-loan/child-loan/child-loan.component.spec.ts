import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildLoanComponent } from './child-loan.component';

describe('ChildLoanComponent', () => {
  let component: ChildLoanComponent;
  let fixture: ComponentFixture<ChildLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
