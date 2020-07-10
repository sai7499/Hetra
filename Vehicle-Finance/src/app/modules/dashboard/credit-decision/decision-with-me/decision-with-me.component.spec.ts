import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionWithMeComponent } from './decision-with-me.component';

describe('DecisionWithMeComponent', () => {
  let component: DecisionWithMeComponent;
  let fixture: ComponentFixture<DecisionWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
