import { Component, OnInit, OnChanges } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LeadSectionService } from 'src/app/services/lead-section.service';
import { VehicleDetails } from '../../../model/lead.model';
import { LeadStoreService } from 'src/app/services/lead-store.service';

@Component({
  selector: "app-vehicle-details",
  templateUrl: "./vehicle-details.component.html",
  styleUrls: ["./vehicle-details.component.css"]
})
export class VehicleDetailComponent implements OnInit, OnChanges {
  public createVehicleDetailForm: FormGroup;
  public labels = [];
  public errorMsg;
  public lov = [];
  public show: boolean = false;
  
  constructor(private leadSectionService: LeadSectionService,
              private leadStoreService: LeadStoreService,
              private router: Router ) {}

  initForm() {
    this.createVehicleDetailForm = new FormGroup({
      vehicleType: new FormControl(''),
      region: new FormControl(''),
      registrationNumber: new FormControl(''),
      assetMake: new FormControl(''),
      assetModel: new FormControl(''),
      assetBodyType: new FormControl(''),
      assetVariant: new FormControl(''),
      assetSubVariant: new FormControl(''),
      orpFunding: new FormControl(''),
      oneTimeTax: new FormControl(''),
      pac: new FormControl(''),
      vas: new FormControl(''),
      emiProduct: new FormControl(''),
      fastTag: new FormControl(''),
      others: new FormControl(''),
      discount: new FormControl(''),
      finalAssetCost: new FormControl(''),
      idv: new FormControl(''),
      insuranceValidity: new FormControl(''),
      noOfVehicle: new FormControl('')
    });
  }

  ngOnInit() {
    this.getLabel();
    this.getLov();
  }

  public getLabel() {
    this.leadSectionService.getLabels().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      }
    );
  }

  public getLov() {
    this.leadSectionService.getLovs().subscribe(
      lovData => {
        // console.log("LOVDATA---->", lovData);
        // Assign the JSONlov to local variables
        this.lov = lovData[0].vehicleDetails[0];
        // console.log("LOV---->", this.lov);
      },
      error => {
        this.errorMsg = error;
      }
    );
  }

  ngOnChanges() { }

  //To show and hide lov--select Open in Vehicle dependency
  onShow(event) {
    // console.log("event ", event.target.value);
    if (event.target.value === "Open") {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  onSubmit() {
    const formValue = this.createVehicleDetailForm.value;
    const vehicleDetailsModel: VehicleDetails = {...formValue};
    this.leadStoreService.setVehicleDetails(vehicleDetailsModel);
    this.router.navigate(['/pages/lead-section/applicant-details']);
  }

}
