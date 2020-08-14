import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiResidenceComponent } from './fi-residence.component';

describe('FiResidenceComponent', () => {
  let component: FiResidenceComponent;
  let fixture: ComponentFixture<FiResidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiResidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiResidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
