import { Component, OnInit } from '@angular/core';
import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {
  values: any = [];
   public labels:any;
  

  constructor(private leadSectionService: VehicleDetailService, private lovData: LovDataService,private labelsData : LabelsService) { }

  ngOnInit() {


    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].sourcingDetails[0];
    });

    this.labelsData.getLabelsData().subscribe(
      data =>{

        this.labels = data
        // console.log(this.labels)
      },
      error =>{
        console.log(error);
        
      }
      
    )

   
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

}
