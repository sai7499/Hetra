import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TvrDetailsComponent } from './tvr-details.component';

describe('TvrDetailsComponent', () => {
  let component: TvrDetailsComponent;
  let fixture: ComponentFixture<TvrDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TvrDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
