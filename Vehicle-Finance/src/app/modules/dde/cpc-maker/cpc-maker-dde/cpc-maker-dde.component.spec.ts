import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpcMakerDdeComponent } from './cpc-maker-dde.component';

describe('CpcMakerDdeComponent', () => {
  let component: CpcMakerDdeComponent;
  let fixture: ComponentFixture<CpcMakerDdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpcMakerDdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpcMakerDdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
