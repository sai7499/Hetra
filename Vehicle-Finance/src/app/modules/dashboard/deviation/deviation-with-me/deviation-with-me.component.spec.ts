import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationWithMeComponent } from './deviation-with-me.component';

describe('DeviationWithMeComponent', () => {
  let component: DeviationWithMeComponent;
  let fixture: ComponentFixture<DeviationWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviationWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviationWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
