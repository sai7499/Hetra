import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { FleetDetailsService } from '../services/fleet-details.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fleet-details',
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.css']
})
export class FleetDetailsComponent implements OnInit {

  public fleetForm: FormGroup;
  labels: any = {};
  values: any = [];
  leadId: number;
  userId: number;
  fleetDetails: any = [];
  fleetLov: any = [];
  fleetArray = [];

  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private fleetDetailsService: FleetDetailsService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }


  async ngOnInit() {

    // accessing lead if from route

    this.leadId = (await this.getLeadId()) as number;
    console.log("leadID =>", this.leadId)

    // method for getting all vehicle details related to a lead

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    // this.leadId = leadData['leadId']

    console.log("user id ==>", this.userId)

    this.getLov();
    this.getFleetDetails();

    this.fleetForm = this.fb.group(
      {
        Rows: this.fb.array([])
      }
    );


    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].fleetDetails[0];
    });

    this.labelsData.getLabelsFleetData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      });





  }

  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }
        resolve(null);
      });
    });
  }
  get formArr() {
    return this.fleetForm.get('Rows') as
      FormArray;
  }

  initRows(rowData) {
    if (rowData) {
      return this.fb.group({
        regdNo: [rowData.regdNo],
        regdOwner: [rowData.regdOwner],
        relation: [rowData.relation],
        make: [rowData.make],
        yom: [rowData.yom],
        financier: [rowData.financier],
        loanNo: [rowData.loanNo],
        purchaseDate: [rowData.purchaseDate ? this.dateDbFormat(rowData.purchaseDate ): ""],
        tenure: [rowData.tenure],
        paid: [rowData.paid],
        seasoning: [rowData.seasoning],
        // ad: [{ value: rowData.ad, disabled: true }],
        ad: [rowData.ad],
        // pd: [{ value: rowData.pd, disabled: true }],
        pd: [rowData.pd],
        // gridValue: [{ value: rowData.gridValue, disabled: true }],
        gridValue: [rowData.gridValue],
        id: [rowData.id]
      })
    }
    else return this.fb.group({
      // id: [],
      regdNo: [''],
      regdOwner: [],
      relation: [''],
      make: [''],
      yom: [],
      financier: [''],
      loanNo: [''],
      purchaseDate: [''],
      tenure: [],
      paid: [],
      seasoning: [''],
      // ad: [{ value: "", disabled: true }],
      ad: [],
      // pd: [{ value: "", disabled: true }],
      pd: [],
      // gridValue: [{ value: "", disabled: true }]
      gridValue: [],
    });
  }

  getLov() {

    this.commonLovService.getLovData().subscribe((value: any) => {
      this.fleetLov.applicantRelationshipWithLead = value.LOVS.applicantRelationshipWithLead;
      this.fleetLov.vehicleFinanciers = value.LOVS.vehicleFinanciers;
      this.fleetLov.vehicleManufacturer = value.LOVS.vehicleManufacturer;
    });

  }

  getDateFormat(date) {
    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(month + '/' + day + '/' + year);
    year = dateFormat.getFullYear();
    month = Number(dateFormat.getMonth()) + 1;
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
   const formattedDate = year + '-' + month1 + '-' + day;
  //   const formattedDate = day + '-' + month1 + '-' + year;
    return formattedDate;
  }

  dateDbFormat(date){
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
     const formattedDate = year + '-' + month1 + '-' + day;
    // const formattedDate = day + '-' + month1 + '-' + year;
    return formattedDate;
  }

  sendDate(date) {
    const dateFormat: Date = new Date(date);
    let year = dateFormat.getFullYear();
    let month = Number(dateFormat.getMonth()) + 1;
    let day = dateFormat.getDate().toString();
    let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result

    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result

    const formattedDate = day + "/" + month1 + "/" + year;
    return formattedDate;

  }

  // method for saving and updating fleet details

  saveOrUpdateFleetDetails() {
    console.log(this.fleetDetails);
    for(let i=0 ; i< this.fleetDetails.length ; i++){
      this.fleetDetails[i]['purchaseDate'] = this.sendDate(this.fleetDetails[i]['purchaseDate'])
    }
  //  this.fleetDetails['purchaseDate'] = this.sendDate(this.fleetDetails['purchaseDate'])
    const data = {
      leadId: this.leadId,
      userId: this.userId,
      fleets: this.fleetDetails,
    }
    // console.log("in save fleet", this.fleetDetails)
    this.fleetDetailsService.saveOrUpdateFleetDetails(data).subscribe((res: any) => {
      console.log("saveFleetDetailsResponse", res)
    });
  }

  //  method for getting fleet Details

  getFleetDetails() {
    const data = {
      leadId: this.leadId
    }
    this.fleetDetailsService.getFleetDetails(data).subscribe((res: any) => {
      if (res['Status'] == "Execution Completed" && res.ProcessVariables.fleets != null) {
        const fleets = res['ProcessVariables'].fleets;
        for (let i = 0; i < fleets.length; i++) {
          if (i == 0) {
            this.formArr.push(this.initRows(fleets[i]))
          }
          else {
            this.addNewRow(fleets[i]);
          }
        }
      } else {
        this.formArr.push(this.initRows(null));
      }

      console.log("get fleet response", res.ProcessVariables.fleets)
    })
  }


  addNewRow(rowData) {
    this.formArr.push(this.initRows(rowData));
  }

  deleteRow(index: number) {
    // console.log("in delete row ", fleets)
    this.formArr.removeAt(index);
    // if (fleets.length > 1) {
    //   fleets.splice(i, 1)
    // } else {
    //   alert("Atleast One Row Required");

  }

  getRtr(fleetid: number) {
    console.log("in getRtr", fleetid)
    // this.router.navigateByUrl('pages/dde/' + this.leadId + '/track-vehicle' , { state: { id:fleetid } });
   this.router.navigate(['pages/dde/' + this.leadId + '/track-vehicle/' + fleetid])
  }

  toCollaterals() {
    this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list'])
  }


  onFormSubmit() {

    this.fleetDetails = this.fleetForm.value.Rows
    console.log(this.fleetDetails)
    this.saveOrUpdateFleetDetails();
  }
}


