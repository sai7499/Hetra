import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiListComponent } from './fi-list.component';

describe('FiListComponent', () => {
  let component: FiListComponent;
  let fixture: ComponentFixture<FiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
