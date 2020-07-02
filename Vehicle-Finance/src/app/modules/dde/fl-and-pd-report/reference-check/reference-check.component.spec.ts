import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceCheckComponent } from './reference-check.component';

describe('ReferenceCheckComponent', () => {
  let component: ReferenceCheckComponent;
  let fixture: ComponentFixture<ReferenceCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
