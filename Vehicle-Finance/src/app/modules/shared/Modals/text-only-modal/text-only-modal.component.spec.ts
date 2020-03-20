import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextOnlyModalComponent } from './text-only-modal.component';

describe('TextOnlyModalComponent', () => {
  let component: TextOnlyModalComponent;
  let fixture: ComponentFixture<TextOnlyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextOnlyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextOnlyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
