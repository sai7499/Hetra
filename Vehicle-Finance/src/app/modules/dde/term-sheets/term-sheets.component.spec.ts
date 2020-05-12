import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermSheetsComponent } from './term-sheets.component';

describe('TermSheetsComponent', () => {
  let component: TermSheetsComponent;
  let fixture: ComponentFixture<TermSheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermSheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
