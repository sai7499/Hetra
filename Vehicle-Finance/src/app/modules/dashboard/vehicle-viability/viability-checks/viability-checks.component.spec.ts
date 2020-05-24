import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViabilityChecksComponent } from './viability-checks.component';

describe('ViabilityChecksComponent', () => {
  let component: ViabilityChecksComponent;
  let fixture: ComponentFixture<ViabilityChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViabilityChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViabilityChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
