import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerLeadsWithMeComponent } from './maker-leads-with-me.component';

describe('MakerLeadsWithMeComponent', () => {
  let component: MakerLeadsWithMeComponent;
  let fixture: ComponentFixture<MakerLeadsWithMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerLeadsWithMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerLeadsWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
