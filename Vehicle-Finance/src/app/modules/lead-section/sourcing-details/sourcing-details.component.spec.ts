import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingDetailsComponent } from './sourcing-details.component';

describe('SourcingDetailsComponent', () => {
  let component: SourcingDetailsComponent;
  let fixture: ComponentFixture<SourcingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourcingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
