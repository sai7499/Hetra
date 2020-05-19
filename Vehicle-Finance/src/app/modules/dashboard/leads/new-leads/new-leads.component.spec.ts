import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadsComponent } from './new-leads.component';

describe('NewLeadsComponent', () => {
  let component: NewLeadsComponent;
  let fixture: ComponentFixture<NewLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
