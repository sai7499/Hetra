import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDdeComponent } from './product-dde.component';

describe('ProductDdeComponent', () => {
  let component: ProductDdeComponent;
  let fixture: ComponentFixture<ProductDdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
