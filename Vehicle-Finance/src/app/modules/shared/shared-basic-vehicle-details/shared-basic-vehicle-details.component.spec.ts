import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBasicVehicleDetailsComponent } from './shared-basic-vehicle-details.component';

describe('SharedBasicVehicleDetailsComponent', () => {
  let component: SharedBasicVehicleDetailsComponent;
  let fixture: ComponentFixture<SharedBasicVehicleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedBasicVehicleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBasicVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
