import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InAppcameraComponent } from './in-appcamera.component';

describe('InAppcameraComponent', () => {
  let component: InAppcameraComponent;
  let fixture: ComponentFixture<InAppcameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InAppcameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InAppcameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
