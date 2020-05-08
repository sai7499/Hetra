import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantdocumentComponent } from './applicantdocument.component';

describe('ApplicantdocumentComponent', () => {
  let component: ApplicantdocumentComponent;
  let fixture: ComponentFixture<ApplicantdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
