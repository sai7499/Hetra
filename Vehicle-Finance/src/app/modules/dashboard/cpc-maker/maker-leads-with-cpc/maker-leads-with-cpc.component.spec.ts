import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerLeadsWithCpcComponent } from './maker-leads-with-cpc.component';

describe('MakerLeadsWithCpcComponent', () => {
  let component: MakerLeadsWithCpcComponent;
  let fixture: ComponentFixture<MakerLeadsWithCpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakerLeadsWithCpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerLeadsWithCpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
