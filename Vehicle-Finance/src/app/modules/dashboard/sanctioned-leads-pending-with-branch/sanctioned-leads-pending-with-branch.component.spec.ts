import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionedLeadsPendingWithBranchComponent } from './sanctioned-leads-pending-with-branch.component';

describe('SanctionedLeadsPendingWithBranchComponent', () => {
  let component: SanctionedLeadsPendingWithBranchComponent;
  let fixture: ComponentFixture<SanctionedLeadsPendingWithBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanctionedLeadsPendingWithBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanctionedLeadsPendingWithBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
