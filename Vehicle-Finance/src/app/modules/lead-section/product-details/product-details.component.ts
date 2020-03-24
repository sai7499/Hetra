import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  public model : any = { details :{ }};
  
  constructor(private leadSectionService: VehicleDetailService, private leadService: LeadStoreService ) { }

  ngOnInit() {
  }

  locationBack() {
    
    this.leadSectionService.setCurrentPage(0);
  }

  onProductSUbmit() {
    const formValue: any = {};

    const businessDivison = formValue.businessDivison;
    const product = formValue.product;
    const schemePromotion = formValue.schemePromotion;
    const subventionApplied = formValue.subventionApplied;
    const subventionIncentive = formValue.subventionIncentive;
    const productModel = {
      businessDivison,
      product,
      schemePromotion,
      subventionApplied,
      subventionIncentive
    };
    this.leadService.setProductDetails(productModel);
  }

}
