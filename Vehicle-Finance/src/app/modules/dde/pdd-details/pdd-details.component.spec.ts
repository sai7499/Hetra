import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PddDetailsComponent } from './pdd-details.component';

describe('PddDetailsComponent', () => {
  let component: PddDetailsComponent;
  let fixture: ComponentFixture<PddDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PddDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
