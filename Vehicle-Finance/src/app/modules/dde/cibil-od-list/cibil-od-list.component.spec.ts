import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilOdListComponent } from './cibil-od-list.component';

describe('CibilOdListComponent', () => {
  let component: CibilOdListComponent;
  let fixture: ComponentFixture<CibilOdListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CibilOdListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CibilOdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
