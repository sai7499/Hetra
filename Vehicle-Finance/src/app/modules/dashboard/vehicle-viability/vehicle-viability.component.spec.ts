import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleViabilityComponent } from './vehicle-viability.component';

describe('VehicleViabilityComponent', () => {
  let component: VehicleViabilityComponent;
  let fixture: ComponentFixture<VehicleViabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleViabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleViabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
