import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDedupeComponent } from './lead-dedupe.component';

describe('LeadDedupeComponent', () => {
  let component: LeadDedupeComponent;
  let fixture: ComponentFixture<LeadDedupeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadDedupeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDedupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
