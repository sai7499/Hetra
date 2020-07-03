import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpcMakerComponent } from './cpc-maker.component';

describe('CpcMakerComponent', () => {
  let component: CpcMakerComponent;
  let fixture: ComponentFixture<CpcMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpcMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpcMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
