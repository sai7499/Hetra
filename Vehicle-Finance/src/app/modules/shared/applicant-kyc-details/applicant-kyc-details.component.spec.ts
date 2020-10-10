import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantKycDetailsComponent } from './applicant-kyc-details.component';

describe('ApplicantKycDetailsComponent', () => {
  let component: ApplicantKycDetailsComponent;
  let fixture: ComponentFixture<ApplicantKycDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantKycDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantKycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
