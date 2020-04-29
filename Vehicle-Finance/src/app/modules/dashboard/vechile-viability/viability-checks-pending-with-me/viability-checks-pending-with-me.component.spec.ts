import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViabilityChecksPendingWithMeComponent } from './viability-checks-pending-with-me.component';

describe('ViabilityChecksPendingWithMeComponent', () => {
  let component: ViabilityChecksPendingWithMeComponent;
  let fixture: ComponentFixture<ViabilityChecksPendingWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViabilityChecksPendingWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViabilityChecksPendingWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
