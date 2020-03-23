import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {
  values: any = [];

  constructor(private leadSectionService: VehicleDetailService, private lovData: LovDataService) { }

  ngOnInit() {
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].sourcingDetails[0];
    });
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

}
