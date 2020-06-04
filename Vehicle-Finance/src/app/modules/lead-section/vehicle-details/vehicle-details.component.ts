import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { LovDataService } from '@services/lov-data.service';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {

  vehicleForm: FormGroup;

  public leadId: number;

  public vehicleLov: any = {};
  public label: any = {};
  public errorMsg;
  public getAllFieldLabel;
  public show = false;
  public vehicleDetails: any;
  public isAlert = true;

  public varVehicle = [];

  constructor(
    private labelsData: LabelsService,
    private lovDataService: LovDataService,
    private router: Router,
    private activateroute: ActivatedRoute,
    private leadStoreService: LeadStoreService,
    private createLeadDataService: CreateLeadDataService) { }


  ngOnInit() {
    this.initForm();
    this.getAllFieldLabel = this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          this.errorMsg = error;
        });
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.vehicleLov = value ? value[0].vehicleDetails[0] : {};
      this.vehicleLov.assetMake = value[0].vehicleDetails[0].assetMake;
      this.vehicleLov.assetModel = value[0].vehicleDetails[0].assetModel;
      this.vehicleLov.assetVariant = value[0].vehicleDetails[0].assetVariant;

      this.getData();

    });
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId']
  }

  initForm() {
    this.vehicleForm = new FormGroup({
      vehicleType: new FormControl(''),
      region: new FormControl(''),
      registrationNumber: new FormControl(''),
      assetMake: new FormControl(''),
      assetModel: new FormControl(''),
      assetBodyType: new FormControl(''),
      assetVariant: new FormControl(''),
      assetSubVariant: new FormControl(''),
      monthManufacturing: new FormControl(''),
      yrManufacturing: new FormControl(''),
      ageOfAsset: new FormControl(''),
      vechicalUsage: new FormControl(''),
      vehicleCategory: new FormControl(''),
      orpFunding: new FormControl(''),
      oneTimeTax: new FormControl(''),
      pac: new FormControl(''),
      vas: new FormControl(''),
      emiProtect: new FormControl(''),
      fastTag: new FormControl(''),
      others: new FormControl(''),
      discount: new FormControl(''),
      finalAssetCost: new FormControl(''),
      idv: new FormControl(''),
      insuranceValidity: new FormControl(''),
      insuranceCopy: new FormControl(''),
      permitType: new FormControl(''),
      expiryDate: new FormControl(''),
      permitCopy: new FormControl(''),
      permitOthers: new FormControl(''),
      frsdRequired: new FormControl(''),
      frsdAmount: new FormControl(''),
      fitnessDate: new FormControl(''),
      fitnessCopy: new FormControl(''),
      noOfVehicle: new FormControl(''),
    });
  }

  onFormSubmit() {
    this.isAlert = false;
    setTimeout(() => {
      this.isAlert = true;
    }, 1500);

  }
  getData() {

    this.vehicleDetails = this.leadStoreService.getVehicleDetails();
    this.vehicleDetails.findIndex(x => x.assetMake === this.vehicleLov.assetMake.forEach(element => {
      if (parseInt(x.assetMake) === element.key) {
        x.assetMake = element;
      }
    }));
    // tslint:disable-next-line: no-shadowed-variable
    this.vehicleDetails.findIndex(x => x.assetModel === this.vehicleLov.assetModel.forEach(element => {
      // tslint:disable-next-line: radix
      if (parseInt(x.assetModel) === element.key) {
        x.assetModel = element;
      }
    }));
    // tslint:disable-next-line: no-shadowed-variable
    this.vehicleDetails.findIndex(x => x.assetVariant === this.vehicleLov.assetVariant.forEach(element => {
      // tslint:disable-next-line: radix
      if (parseInt(x.assetVariant) === element.key) {
        x.assetVariant = element;
      }
    }));

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges() { }

  editVehicle(index: number) {
    this.router.navigate(['pages/lead-section/add-vehicle', { id: index }]);
  }

  deleteVehicle(index: number) {
    this.leadStoreService.deleteVehicle(index);
  }

  // To show and hide lov--select "Open" in Vehicle dependency
  onShow(event) {
    if (event.target.value === '1') {
      this.show = true;
    } else {
      this.show = false;
    }
  }

}
