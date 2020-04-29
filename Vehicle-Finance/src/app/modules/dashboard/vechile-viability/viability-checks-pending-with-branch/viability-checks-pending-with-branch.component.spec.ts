import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViabilityChecksPendingWithBranchComponent } from './viability-checks-pending-with-branch.component';

describe('ViabilityChecksPendingWithBranchComponent', () => {
  let component: ViabilityChecksPendingWithBranchComponent;
  let fixture: ComponentFixture<ViabilityChecksPendingWithBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViabilityChecksPendingWithBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViabilityChecksPendingWithBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
