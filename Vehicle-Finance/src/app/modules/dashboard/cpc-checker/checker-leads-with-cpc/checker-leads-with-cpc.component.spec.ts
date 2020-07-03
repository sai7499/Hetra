import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerLeadsWithCpcComponent } from './checker-leads-with-cpc.component';

describe('CheckerLeadsWithCpcComponent', () => {
  let component: CheckerLeadsWithCpcComponent;
  let fixture: ComponentFixture<CheckerLeadsWithCpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckerLeadsWithCpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckerLeadsWithCpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
