import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionDetailsComponent } from './sanction-details.component';

describe('SanctionDetailsComponent', () => {
  let component: SanctionDetailsComponent;
  let fixture: ComponentFixture<SanctionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanctionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanctionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
