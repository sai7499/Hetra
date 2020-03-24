import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
<<<<<<< HEAD
import { LabelsService } from 'src/app/services/labels.service';

=======
import { LeadStoreService } from '@services/lead-store.service';
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
<<<<<<< HEAD

  values: any = [];
  
  public labels:any;

  constructor(private leadSectionService: VehicleDetailService, private lovData: LovDataService ,private labelsData:LabelsService) {

   }
=======
  productForm: FormGroup;
  values: any = [];
  constructor(
    private leadSectionService: VehicleDetailService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService ) { }
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c

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

<<<<<<< HEAD
    this.labelsData.getLabelsData().subscribe( 
      data => {
        
        this.labels = data
        console.log(this.labels)
      }
      
    ) 

=======
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c
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
