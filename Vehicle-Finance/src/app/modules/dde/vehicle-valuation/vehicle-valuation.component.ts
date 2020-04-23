import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';

import { LabelsService } from "@services/labels.service";
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

@Component({
  selector: "app-vehicle-valuation",
  templateUrl: "./vehicle-valuation.component.html",
  styleUrls: ["./vehicle-valuation.component.css"]
})
export class VehicleValuationComponent implements OnInit {

  public vhValLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;

  isModal: boolean;
  isOk: boolean;
  isYes: boolean;

  constructor(private labelsData: LabelsService, 
              private lovDataService:LovDataService,
              private router: Router,
              private ddeStoreService: DdeStoreService) {}

  ngOnInit() {

    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
      
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.vhValLov = value ? value[0].vehicleVal[0] : {};
      // console.log('vhValLov', this.vhValLov);
    });

  }

  onChange() {
    this.router.navigateByUrl('pages/dde/valuation');

  }

  OnSubmit(){
    this.isModal = true;
    // console.log("ONSUB", this.isModal);
    
  }

  closeModal(){
    this.isModal = false
  }

  okModal() {
    this.isOk = true;
    // console.log("OKModal", this.isOk);
    
  }

  yesModal() {
    this.isYes = true;
    // console.log("yesModal", this.isYes);
    
  }
  
  onFormSubmit() {
    this.router.navigate(['/pages/dde/cam']);
  }

}
