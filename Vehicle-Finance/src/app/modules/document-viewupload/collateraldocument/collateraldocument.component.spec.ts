import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateraldocumentComponent } from './collateraldocument.component';

describe('CollateraldocumentComponent', () => {
  let component: CollateraldocumentComponent;
  let fixture: ComponentFixture<CollateraldocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateraldocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateraldocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
