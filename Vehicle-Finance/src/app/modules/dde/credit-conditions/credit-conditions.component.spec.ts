import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditConditionsComponent } from './credit-conditions.component';

describe('CreditConditionsComponent', () => {
  let component: CreditConditionsComponent;
  let fixture: ComponentFixture<CreditConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
