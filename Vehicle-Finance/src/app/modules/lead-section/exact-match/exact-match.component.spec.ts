import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExactMatchComponent } from './exact-match.component';

describe('ExactMatchComponent', () => {
  let component: ExactMatchComponent;
  let fixture: ComponentFixture<ExactMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExactMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExactMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
