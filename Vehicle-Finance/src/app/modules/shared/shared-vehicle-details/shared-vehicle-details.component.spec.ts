import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedVehicleDetailsComponent } from './shared-vehicle-details.component';

describe('SharedVehicleDetailsComponent', () => {
  let component: SharedVehicleDetailsComponent;
  let fixture: ComponentFixture<SharedVehicleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedVehicleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
