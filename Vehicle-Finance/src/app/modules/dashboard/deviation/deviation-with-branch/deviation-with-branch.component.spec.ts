import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationWithBranchComponent } from './deviation-with-branch.component';

describe('DeviationWithBranchComponent', () => {
  let component: DeviationWithBranchComponent;
  let fixture: ComponentFixture<DeviationWithBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviationWithBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationWithBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
