import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';
import { CommomLovService } from '@services/commom-lov-service';
import { FleetDetailsService } from '../services/fleet-details.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { CommentStmt } from '@angular/compiler';
import { UtilityService } from '@services/utility.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { TypeaheadOptions } from 'ngx-bootstrap/typeahead/public_api';

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
  formValue: any;
  toDayDate: Date = new Date();
  // relationSelected = []
  relation: any[];
  make: any = [];
  financierName: any = [];
  // vehicleId: any;
  fleetIDs: any = [];
  fleetId: any;
  constructor(

    private labelsData: LabelsService,
    private fb: FormBuilder,
    private lovData: LovDataService,
    private fleetDetailsService: FleetDetailsService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private sharedService: SharedService) { }


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

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

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
    // if (rowData) {
    //   return this.fb.group({
    //     regdNo: [rowData.regdNo],
    //     regdOwner: [rowData.regdOwner],
    //     relation: [rowData.relation],
    //     make: [rowData.make],
    //     yom: [rowData.yom],
    //     financier: [rowData.financier],
    //     loanNo: [rowData.loanNo],
    //     purchaseDate: [rowData.purchaseDate ? this.dateDbFormat(rowData.purchaseDate) : ""],
    //     tenure: [rowData.tenure],
    //     paid: [rowData.paid],
    //     seasoning: [rowData.seasoning],
    //     // ad: [{ value: rowData.ad, disabled: true }],
    //     ad: [rowData.ad],
    //     // pd: [{ value: rowData.pd, disabled: true }],
    //     pd: [rowData.pd],
    //     // gridValue: [{ value: rowData.gridValue, disabled: true }],
    //     gridValue: [rowData.gridValue],
    //     id: [rowData.id]
    //   })
    // }
    if (rowData) {
      return this.fb.group({
        regdNo: new FormControl(rowData.regdNo, Validators.compose([Validators.required, Validators.minLength(8)])),
        regdOwner: new FormControl(rowData.regdOwner, Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)])),
        relation: new FormControl(rowData.relation, [Validators.required]),
        make: new FormControl(rowData.make, [Validators.required]),
        yom: new FormControl(rowData.yom, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(4)])),
        financier: new FormControl(rowData.financier, [Validators.required]),
        loanNo: new FormControl(rowData.loanNo, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(20)])),
        purchaseDate: new FormControl(rowData.purchaseDate ? this.getDateFormat(rowData.purchaseDate) : "", Validators.compose([Validators.required])),
        tenure: new FormControl(rowData.tenure, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(1), Validators.maxLength(3)])),
        paid: new FormControl(rowData.paid, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(1), Validators.maxLength(3)])),
        seasoning: new FormControl({ value: rowData.seasoning, disabled: true }),
        ad: new FormControl({ value: rowData.ad, disabled: true }),
        pd: new FormControl({ value: rowData.pd, disabled: true }),
        gridValue: new FormControl({ value: rowData.gridValue, disabled: true }),
        id: rowData.id
      })
    }
    else return this.fb.group({
      // id: [],
      regdNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      regdOwner: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)])),
      relation: new FormControl('', [Validators.required]),
      make: new FormControl('', [Validators.required]),
      yom: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(4)])),
      financier: new FormControl('', [Validators.required]),
      loanNo: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(4)])),
      purchaseDate: new FormControl('', [Validators.required]),
      tenure: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(2), Validators.maxLength(3)])),
      paid: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(1), Validators.maxLength(3)])),
      seasoning: new FormControl({ value: '', disabled: true }),
      ad: new FormControl({ value: '', disabled: true }),
      pd: new FormControl({ value: '', disabled: true }),
      gridValue: new FormControl({ value: '', disabled: true }),
    });
  }

  getLov() {

    this.commonLovService.getLovData().subscribe((value: any) => {
      this.fleetLov.applicantRelationshipWithLead = value.LOVS.applicantRelationshipWithLead;
      this.fleetLov.vehicleFinanciers = value.LOVS.vehicleFinanciers;
      this.fleetLov.vehicleManufacturer = value.LOVS.vehicleManufacturer;
    });

  }

  relationShipChange(event) {
    this.relation = [];
    console.log('relationShipChange', event.target.value);
    const relation = event.target.value;
  }

  makeChange(event) {
    this.make = [];
    console.log('make ', event.target.value);
    const make = event.target.value;
  }
  financierChange(event) {
    this.financierName = [];
    console.log('financier name', event.target.value);
    const financierName = event.target.value;
  }

  getDateFormat(date) {

    // console.log("in getDateFormat", date)

    var datePart = date.match(/\d+/g);
    var month = datePart[1];
    var day = datePart[0];
    var year = datePart[2];
    const dateFormat: Date = new Date(year + '/' + month + '/' + day);

    // year = dateFormat.getFullYear();
    // month = Number(dateFormat.getMonth()) + 1;
    // let month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    // day = dateFormat.getDate().toString();
    // day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    // const formattedDate = year + '-' + month1 + '-' + day;
    // //   const formattedDate = day + '-' + month1 + '-' + year;
    // console.log("formattedDate", formattedDate)
    return dateFormat;
  }

  dateDbFormat(date) {
    // console.log("in dataDbFormat", date)
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = year + '-' + month1 + '-' + day;
    // const formattedDate = day + '-' + month1 + '-' + year;
    // console.log("res", formattedDate)
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

  saveOrUpdateFleetDetails(index) {
    //console.log(this.fleetDetails);
    for (let i = 0; i < this.fleetDetails.length; i++) {
      this.fleetDetails[i]['purchaseDate'] = this.sendDate(this.fleetDetails[i]['purchaseDate'])
    }
    //  this.fleetDetails['purchaseDate'] = this.sendDate(this.fleetDetails['purchaseDate'])
    const data = {
      leadId: this.leadId,
      userId: this.userId,
      fleets: this.fleetDetails,
    }
    //  console.log("in save fleet", this.fleetDetails)
    this.fleetDetailsService.saveOrUpdateFleetDetails(data).subscribe((res: any) => {
      console.log("saveFleetDetailsResponse", res.ProcessVariables.ids)
      this.fleetIDs = res.ProcessVariables.ids
      console.log("saveFleetDetailsResponse", this.fleetIDs)
      this.toasterService.showSuccess('Fleet saved successfully!', '');
      if (index != null) {
        console.log("index", index)
        // console.log("fletds", this.fleetIDs)

        this.fleetId = this.fleetIDs[index];
        console.log("this fleet id", this.fleetId)
        this.router.navigate(['pages/dde/' + this.leadId + '/track-vehicle/' + this.fleetId])

      }
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
      // console.log("in get fleets", res.ProcessVariables.fleets)
      // console.log("get fleet response", res.ProcessVariables.fleets)
      // console.log("fleet form controls", this.fleetForm.controls.Rows)
    })
  }


  addNewRow(rowData) {
    this.formArr.push(this.initRows(rowData));
  }

  deleteRow(index: number, fleets: any) {
    console.log("in delete row fn ", fleets, index)
    this.formArr.removeAt(index);
    if (fleets.length > 1) {
      // console.log("inside del fun", fleets)

      // console.log("vehicleId", fleets[index].id)

      const data = {
        id: fleets[index].id,
        leadId: this.leadId
      }

      this.fleetDetailsService.deleteFleetDetails(data).subscribe((res: any) => {

        // console.log("response from delete api", res.ProcessVariables)
      });

      fleets.splice(index, 1)
      this.toasterService.showSuccess("fleet deleted successfully!", '')

    } else {
      this.toasterService.showError("atleast one row required !", '')

    }
  }

  getRtr(index: number) {

    // if (this.fleetIDs! = null) {
    //   this.fleetId = (this.fleetIDs)


    //   console.log("fleet id", this.fleetId)
    // }
    // else {
    //   console.log("fleets not recieved")
    // }

    // if (this.fleetId) {
    //   // console.log("in getRtr", fleetid)
    //   // this.router.navigateByUrl('pages/dde/' + this.leadId + '/track-vehicle' , { state: { id:fleetid } });
    //   this.router.navigate(['pages/dde/' + this.leadId + '/track-vehicle/' + this.fleetId])

    // }
    // else {
    //   this.toasterService.showError("fleet not saved!", '')
    // }


  }

  toCollaterals() {
    this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list'])
  }


  onFormSubmit(index: number) {

    this.fleetDetails = this.fleetForm.value.Rows;



    if (this.fleetForm.valid === true) {
      // this.fleetDetails = this.fleetForm.value.Rows
      console.log(this.fleetDetails)
      this.saveOrUpdateFleetDetails(index);

    }
    else {
      console.log('Error', this.fleetForm)
      this.toasterService.showError("Please enter valid details!", '')
      this.utilityService.validateAllFormFields(this.fleetForm)

    }
  }
}


