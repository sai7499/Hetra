import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerLeadsWithMeComponent } from './checker-leads-with-me.component';

describe('CheckerLeadsWithMeComponent', () => {
  let component: CheckerLeadsWithMeComponent;
  let fixture: ComponentFixture<CheckerLeadsWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckerLeadsWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckerLeadsWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
