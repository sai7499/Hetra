import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelomceLetterComponent } from './welomce-letter.component';

describe('WelomceLetterComponent', () => {
  let component: WelomceLetterComponent;
  let fixture: ComponentFixture<WelomceLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelomceLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelomceLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
