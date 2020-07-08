import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilOdComponent } from './cibil-od.component';

describe('CibilOdComponent', () => {
  let component: CibilOdComponent;
  let fixture: ComponentFixture<CibilOdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CibilOdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CibilOdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
