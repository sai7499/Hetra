import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  values: any = [];
  
  public labels:any;

  constructor(private leadSectionService: VehicleDetailService, private lovData: LovDataService ,private labelsData:LabelsService) {

   }

  ngOnInit() {
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].productDetails[0];
    });

    this.labelsData.getLabelsData().subscribe( 
      data => {
        
        this.labels = data
        console.log(this.labels)
      }
      
    ) 

  }

  locationBack() {

    this.leadSectionService.setCurrentPage(0);
  }

}
