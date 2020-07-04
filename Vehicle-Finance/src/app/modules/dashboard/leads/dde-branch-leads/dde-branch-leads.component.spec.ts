import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdeBranchLeadsComponent } from './dde-branch-leads.component';

describe('DdeBranchLeadsComponent', () => {
  let component: DdeBranchLeadsComponent;
  let fixture: ComponentFixture<DdeBranchLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdeBranchLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdeBranchLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
