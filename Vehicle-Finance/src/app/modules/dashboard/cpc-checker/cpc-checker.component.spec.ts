import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpcCheckerComponent } from './cpc-checker.component';

describe('CpcCheckerComponent', () => {
  let component: CpcCheckerComponent;
  let fixture: ComponentFixture<CpcCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpcCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpcCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
