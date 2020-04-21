import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposureDetailsComponent } from './exposure-details.component';

describe('ExposureDetailsComponent', () => {
  let component: ExposureDetailsComponent;
  let fixture: ComponentFixture<ExposureDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExposureDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
