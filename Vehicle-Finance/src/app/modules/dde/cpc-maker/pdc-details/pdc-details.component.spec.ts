import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdcDetailsComponent } from './pdc-details.component';

describe('PdcDetailsComponent', () => {
  let component: PdcDetailsComponent;
  let fixture: ComponentFixture<PdcDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdcDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
