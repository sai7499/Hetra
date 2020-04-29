import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecsanctionedLeadsPendingWithBranchComponent } from './secsanctioned-leads-pending-with-branch.component';

describe('SecsanctionedLeadsPendingWithBranchComponent', () => {
  let component: SecsanctionedLeadsPendingWithBranchComponent;
  let fixture: ComponentFixture<SecsanctionedLeadsPendingWithBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecsanctionedLeadsPendingWithBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecsanctionedLeadsPendingWithBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
