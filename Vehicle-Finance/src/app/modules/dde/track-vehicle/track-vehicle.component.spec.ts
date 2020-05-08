import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackVehicleComponent } from './track-vehicle.component';

describe('TrackVehicleComponent', () => {
  let component: TrackVehicleComponent;
  let fixture: ComponentFixture<TrackVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
