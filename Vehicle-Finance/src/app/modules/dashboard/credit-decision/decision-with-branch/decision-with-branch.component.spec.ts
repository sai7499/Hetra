import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionWithBranchComponent } from './decision-with-branch.component';

describe('DecisionWithBranchComponent', () => {
  let component: DecisionWithBranchComponent;
  let fixture: ComponentFixture<DecisionWithBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionWithBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionWithBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
