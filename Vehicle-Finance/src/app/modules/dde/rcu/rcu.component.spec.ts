import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcuComponent } from './rcu.component';

describe('RcuComponent', () => {
  let component: RcuComponent;
  let fixture: ComponentFixture<RcuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
