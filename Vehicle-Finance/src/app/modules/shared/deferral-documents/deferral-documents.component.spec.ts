import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeferralDocumentsComponent } from './deferral-documents.component';

describe('DeferralDocumentsComponent', () => {
  let component: DeferralDocumentsComponent;
  let fixture: ComponentFixture<DeferralDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferralDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferralDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
