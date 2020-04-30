import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinedLeadsWithMeComponent } from './declined-leads-with-me.component';

describe('DeclinedLeadsWithMeComponent', () => {
  let component: DeclinedLeadsWithMeComponent;
  let fixture: ComponentFixture<DeclinedLeadsWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinedLeadsWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedLeadsWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
