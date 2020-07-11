import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdDashboardComponent } from './pd-dashboard.component';

describe('PdDashboardComponent', () => {
  let component: PdDashboardComponent;
  let fixture: ComponentFixture<PdDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
