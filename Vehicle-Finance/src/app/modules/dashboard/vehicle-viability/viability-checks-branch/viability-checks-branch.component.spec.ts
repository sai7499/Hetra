import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViabilityChecksBranchComponent } from './viability-checks-branch.component';

describe('ViabilityChecksBranchComponent', () => {
  let component: ViabilityChecksBranchComponent;
  let fixture: ComponentFixture<ViabilityChecksBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViabilityChecksBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViabilityChecksBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
