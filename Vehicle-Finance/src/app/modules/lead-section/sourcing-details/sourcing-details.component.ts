import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {

  constructor(private leadSectionService: VehicleDetailService) { }

  ngOnInit() {
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

}
