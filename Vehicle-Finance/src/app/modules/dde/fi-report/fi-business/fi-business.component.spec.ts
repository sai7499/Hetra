import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiBusinessComponent } from './fi-business.component';

describe('FiBusinessComponent', () => {
  let component: FiBusinessComponent;
  let fixture: ComponentFixture<FiBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiBusinessComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
