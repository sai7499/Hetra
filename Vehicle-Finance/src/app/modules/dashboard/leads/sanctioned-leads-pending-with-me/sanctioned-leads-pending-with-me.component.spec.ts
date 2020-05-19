import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionedLeadsPendingWithMeComponent } from './sanctioned-leads-pending-with-me.component';

describe('SanctionedLeadsPendingWithMeComponent', () => {
  let component: SanctionedLeadsPendingWithMeComponent;
  let fixture: ComponentFixture<SanctionedLeadsPendingWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanctionedLeadsPendingWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanctionedLeadsPendingWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
