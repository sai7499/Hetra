import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleVerificationFormComponent } from './tele-verification-form.component';

describe('TeleVerificationFormComponent', () => {
  let component: TeleVerificationFormComponent;
  let fixture: ComponentFixture<TeleVerificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeleVerificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleVerificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
