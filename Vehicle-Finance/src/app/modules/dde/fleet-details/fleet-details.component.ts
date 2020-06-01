import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { FleetDetailsService } from '../services/fleet-details.service'
import { CommomLovService } from '@services/commom-lov-service'

@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})
export class FleetDetailsComponent implements OnInit {

  public fleetForm: FormGroup;
  labels: any = {};
  values: any = [];
  leadId: number = 21;
  userId: number = 1001;
  fleetDetails: any = [];
  fleetLov: any = [];

  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private fleetDetailsService: FleetDetailsService,
    private commonLovService: CommomLovService) { }


  ngOnInit() {

    this.getLov();



    this.fleetForm = this.fb.group(
      {
        Rows: this.fb.array([this.initRows()])
      }
    );


    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].fleetDetails[0];
      // console.log(this.values.relation = this.values);
    });

    this.labelsData.getLabelsFleetData().subscribe(
      data => {
        this.labels = data;
        // console.log('labels', this.labels);
      },
      error => {
        console.log(error);

      });

  }

  get formArr() {
    return this.fleetForm.get('Rows') as
      FormArray;
  }

  initRows() {
    return this.fb.group({
      regdNo: [''],
      regdOwner: [],
      relation: [''],
      make: [''],
      yom: [],
      financier: [''],
      loanNo: [''],
      purchaseDate: [''],
      tenure: [''],
      paid: [''],
      seasoning: [''],
      ad: [{ value: "", disabled: true }],
      pd: [{ value: "", disabled: true }],
      gridValue: [{ value: "", disabled: true }]
    });
  }

  //  method for getting Lovs 

  getLov() {

    this.commonLovService.getLovData().subscribe((value: any) => {

      this.fleetLov.applicantRelationshipWithLead = value.LOVS.applicantRelationshipWithLead;
      this.fleetLov.vehicleFinanciers = value.LOVS.vehicleFinanciers;
      this.fleetLov.vehicleManufacturer = value.LOVS.vehicleManufacturer;


      console.log('vehicle lov  => ', this.fleetLov)

    });

  }


  // method for saving and updating fleet details

  saveOrUpdateFleetDetails() {
    const data = {
      leadId: this.leadId,
      userId: this.userId,
      fleetDetails: this.fleetDetails
    }
    this.fleetDetailsService.saveOrUpdateFleetDetails(data).subscribe((value: any) => {

      this.fleetDetails = value;
      console.log("fleet details response", this.fleetDetails.ProcessVariables.fleets)

    });
  }


  addNewRow() {
    this.formArr.push(this.initRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  onFormSubmit() {
    this.saveOrUpdateFleetDetails();
    console.log('form values ', this.fleetForm.value.Rows)
  }
}


