import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPdTasksComponent } from './my-pd-tasks.component';

describe('MyPdTasksComponent', () => {
  let component: MyPdTasksComponent;
  let fixture: ComponentFixture<MyPdTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPdTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPdTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
