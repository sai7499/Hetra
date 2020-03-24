import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productForm: FormGroup;
  values: any = [];
  constructor(
    private leadSectionService: VehicleDetailService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService ) { }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].productDetails[0];
      this.setFormValue();
    });
  }

  initForm() {
    this.productForm = new FormGroup({
      businessDivision: new FormControl(''),
      product: new FormControl(''),
      schemePromotion: new FormControl(''),
      subventionApplied: new FormControl(''),
      subventionIncentive: new FormControl(''),
    });
  }

  setFormValue() {
    const productValue = this.leadStoreService.getProductDetails() || {};
    this.productForm.patchValue({
      businessDivision: productValue.businessDivision || '',
      product: productValue.product || '',
      schemePromotion: productValue.schemePromotion || '',
      subventionApplied: productValue.subventionApplied || '',
      subventionIncentive: productValue.subventionIncentive || ''
    });

  }

  locationBack() {

    this.leadSectionService.setCurrentPage(0);
  }

  onFormSubmit() {
    console.log('form value', this.productForm.value);
    const formValue = this.productForm.value;
    const productModel = {...formValue};
    this.leadStoreService.setProductDetails(productModel);
  }

}
