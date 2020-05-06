import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSectionComponent } from './otp-section.component';

describe('OtpSectionComponent', () => {
  let component: OtpSectionComponent;
  let fixture: ComponentFixture<OtpSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
