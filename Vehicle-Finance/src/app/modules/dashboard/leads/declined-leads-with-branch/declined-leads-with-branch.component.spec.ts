import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedLeadsWithBranchComponent } from './declined-leads-with-branch.component';

describe('DeclinedLeadsWithBranchComponent', () => {
  let component: DeclinedLeadsWithBranchComponent;
  let fixture: ComponentFixture<DeclinedLeadsWithBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinedLeadsWithBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedLeadsWithBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
