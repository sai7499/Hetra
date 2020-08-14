import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementSelfComponent } from './disbursement-self.component';

describe('DisbursementSelfComponent', () => {
  let component: DisbursementSelfComponent;
  let fixture: ComponentFixture<DisbursementSelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursementSelfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
