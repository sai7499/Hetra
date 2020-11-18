import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PSLdataComponent } from './psldata.component';

describe('PSLdataComponent', () => {
  let component: PSLdataComponent;
  let fixture: ComponentFixture<PSLdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PSLdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PSLdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
