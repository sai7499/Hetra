import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrancheDisburseComponent } from './tranche-disburse.component';

describe('TrancheDisburseComponent', () => {
  let component: TrancheDisburseComponent;
  let fixture: ComponentFixture<TrancheDisburseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrancheDisburseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrancheDisburseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
