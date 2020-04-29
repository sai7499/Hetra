import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecsanctionedLeadsPendingWithMeComponent } from './secsanctioned-leads-pending-with-me.component';

describe('SecsanctionedLeadsPendingWithMeComponent', () => {
  let component: SecsanctionedLeadsPendingWithMeComponent;
  let fixture: ComponentFixture<SecsanctionedLeadsPendingWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecsanctionedLeadsPendingWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecsanctionedLeadsPendingWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
