import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchPdTasksComponent } from './branch-pd-tasks.component';

describe('BranchPdTasksComponent', () => {
  let component: BranchPdTasksComponent;
  let fixture: ComponentFixture<BranchPdTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchPdTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchPdTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
