import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingDdeComponent } from './sourcing-dde.component';

describe('SourcingDdeComponent', () => {
  let component: SourcingDdeComponent;
  let fixture: ComponentFixture<SourcingDdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourcingDdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcingDdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
