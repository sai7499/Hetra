import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTasksComponent } from './branch-tasks.component';

describe('BranchTasksComponent', () => {
  let component: BranchTasksComponent;
  let fixture: ComponentFixture<BranchTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
