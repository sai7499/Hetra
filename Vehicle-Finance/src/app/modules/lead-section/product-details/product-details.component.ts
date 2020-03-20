import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  public model : any = { details :{ }};
  
  constructor(private leadSectionService: VehicleDetailService ) { }

  ngOnInit() {
  }

  locationBack() {
    
    this.leadSectionService.setCurrentPage(0);
  }

}
