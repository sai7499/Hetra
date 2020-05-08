import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewuploadComponent } from './document-viewupload.component';

describe('DocumentViewuploadComponent', () => {
  let component: DocumentViewuploadComponent;
  let fixture: ComponentFixture<DocumentViewuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentViewuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
