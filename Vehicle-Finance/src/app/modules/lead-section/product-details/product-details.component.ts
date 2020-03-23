import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  values: any = [];
  constructor(private leadSectionService: VehicleDetailService, private lovData: LovDataService ) { }

  ngOnInit() {
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].productDetails[0];
    });
  }

  locationBack() {

    this.leadSectionService.setCurrentPage(0);
  }

}
