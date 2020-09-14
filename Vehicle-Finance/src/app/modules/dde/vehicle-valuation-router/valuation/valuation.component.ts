import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from "@services/labels.service";
import { ToasterService } from '@services/toaster.service';
import { CommomLovService } from '@services/commom-lov-service';
import { VehicleValuationService } from '@modules/dde/services/vehicle-valuation.service';
import { UtilityService } from '@services/utility.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css']
})
export class ValuationComponent implements OnInit {

  vehicleValuationForm: FormGroup;

  leadId;
  colleteralId;

  LOV: any = [];
  labels: any = {};
  vehicleValuationDetails: any = {};
  isInputField: boolean = false;
  isDirty: boolean;
  customFutureDate: boolean;
  public toDayDate: Date = new Date();
  currentYear = new Date().getFullYear();
  yearCheck = [];
  valuatorType: string;
  valuatorCode: string;
  valuatorName: string;
  nameOfVehicleOwner: string;
  mobileNumberOfVehicleOwner: string;
  vehicleAddress: string;
  vehiclePincode: string;
  assetCostGrid: string;
  disableSaveBtn: boolean;
  leadCreatedDate: any;

  valuesToYesNo: any = [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }];
  monthsLOVS: any = [
    { key: "January", value: "January" }, { key: "February", value: "February" },
    { key: "March", value: "March" }, { key: "April", value: "April" }, { key: "May", value: "May" },
    { key: "June", value: "June" }, { key: "July", value: "July" }, { key: "August", value: "August" },
    { key: "September", value: "September" }, { key: "October", value: "October" },
    { key: "November", value: "November" }, { key: "December", value: "December" },
  ];

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private vehicleValuationService: VehicleValuationService,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private createLeadDataService: CreateLeadDataService,
    private toggleDdeService: ToggleDdeService) { }

  async ngOnInit() {
    this.getLabels();
    this.initForm();
    this.getLOV();
    this.leadId = (await this.getLeadId()) as number;
    // this.getLeadId();
    console.log("LEADID::::", this.leadId);
    this.colleteralId = (await this.getCollateralId()) as Number;
    // this.getCollateralId();
    console.log("COLLATERALID::::", this.colleteralId);
    this.getVehicleValuation();
    this.getLeadSectiondata();
    this.yearCheck = [{ rule: val => val > this.currentYear, msg: 'Future year not accepted' }];
    setTimeout(() => {
      const operationType = this.toggleDdeService.getOperationType();
      if (operationType === '1') {
        this.vehicleValuationForm.disable();
        this.disableSaveBtn = true;
      }
    });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data: any) => (this.labels = data),
      // (error) => console.log("Vehicle Valuation Label Error", error)
    );
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.aRoute.params.subscribe((value) => {
        const leadId = value.leadId;
        if (leadId) {
          resolve(Number(leadId));
        }
        resolve(null);
      });
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
    });
    console.log(" LOV**** --->", this.LOV);
  }

  getCollateralId() {
    return new Promise((resolve, reject) => {
      this.aRoute.firstChild.params.subscribe((value) => {
        const colleteralId = value.colleteralId;
        if (colleteralId) {
          resolve(Number(colleteralId));
        }
        resolve(null);
      });
    });
  }

  //GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    // this.leadCreatedDate = new Date(leadData['leadDetails'].leadCreatedOn);
    this.leadCreatedDate = this.utilityService.getDateFromString(leadData['leadDetails'].leadCreatedOn);
    // console.log("LEAD_CREATED_DATE::", this.vehicleValuationForm.get('valuationDate').value >= this.leadCreatedDate);
    console.log("LEAD_CREATED_DATE::", this.leadCreatedDate);
  }

  //CHANGE EVENT FUNCTION FOR monthLOVS
  onChangeMonthValues(event: any) {
    const monthChange = event.target.value;
    console.log("CHANGE_IN_MONTH::", monthChange);
  }
  
  //CHANGE_YEAR
  onGetDateValue(event: any) {
    const yearOfManufacturer = event.target.value;
    console.log("YEAR_OF_MANUFACTURER::", yearOfManufacturer);
    if (yearOfManufacturer > this.toDayDate) {
      this.customFutureDate = true;
    } else {
      this.customFutureDate = false;
    }
  }

  getVehicleValuation() {
    const data = this.colleteralId;
    console.log("DATA::::", data);
    this.vehicleValuationService.getVehicleValuation(data).subscribe((res: any) => {
      const response = res;
      // console.log("RESPONSE_FROM_GET_VEHICLE_VALUATION_API", response);
      this.vehicleValuationDetails = response.ProcessVariables.vehicleValutionDetails;
      console.log("VEHICLE_VALUATION_DETAILS::", this.vehicleValuationDetails);
      this.valuatorType = this.vehicleValuationDetails.valuatorType;
      this.valuatorCode = this.vehicleValuationDetails.valuatorCode;
      this.valuatorName = this.vehicleValuationDetails.valuatorName;
      this.nameOfVehicleOwner = this.vehicleValuationDetails.vehicleOwnerName;
      this.mobileNumberOfVehicleOwner = this.vehicleValuationDetails.vehicleOwnerMobile;
      this.vehicleAddress = this.vehicleValuationDetails.vehicleAddress;
      this.vehiclePincode = this.vehicleValuationDetails.pincode;
      this.assetCostGrid = this.vehicleValuationDetails.gridAmt;
      this.setFormValue();
      // console.log("VALUATION DATE****", this.vehicleValuationDetails.valuationDate);
    });
  }

  initForm() {
    this.vehicleValuationForm = this.formBuilder.group({
      valuatorType: [{ value: '', disabled: true }],
      valuatorCode: [{ value: '', disabled: true }],
      valuatorName: [{ value: '', disabled: true }],
      vehicleOwnerName: [{ value: '', disabled: true }],
      vehicleOwnerMobile: [{ value: '', disabled: true }],
      vehicleAddress: [{ value: '', disabled: true }],
      pincode: [{ value: '', disabled: true }],
      gridAmt: [{ value: '', disabled: true }],
      valuationAmt: ["", Validators.required],
      valuationDate: ["", Validators.required],
      idv: ["", Validators.required],
      idvValidityDate: ["", Validators.required],
      vehicleAvailGrid: ["", Validators.required],
      // gridAmount: [""],
      make: ["", Validators.required],
      model: ["", Validators.required],
      // newUsedAsset: [""],
      vehiclePrefixNo: ["", Validators.required],
      registrationNo: ["", Validators.required],
      chasisNumber: ["", Validators.required],
      engineNumber: ["", Validators.required],
      yearOfManufacturer: ["", Validators.required],
      monthOfManufacturer: ["", Validators.required],
      ageOfAsset: ["", Validators.required],
      sellerShortDesc: [""],
      secondAsset: [""],
      secondVehiclePrefixNo: [""],
      reRegNumber: [""],
      regChasisNo: [""],
      // agricultureProof: ["", Validators.required],
      fcExpiryDate: ["", Validators.required],
      dateofReg: ["", Validators.required],
      gvw: ["", Validators.required],
      preReRegNumber: ["", Validators.required],
      interStateVehicle: ["", Validators.required],
      duplicateRc: ["", Validators.required],
      cubicCapacity: ["", Validators.required],
      seatingCapacity: ["", Validators.required],
      // existingVechicleOwned: [""],
      // noOfVehicles: [""],
      // existingSelfCostAsset: [""],
      // total: [""],
      // make: [""],
      // model: [""],
      // year: [""],
      // registeredOwner: [""],
      // registeredOwnerName: [""],
      // vehiclehNoPrefix: [""],
      // vehicleNumber: [""],
      // costOfVehicle: [""]
    });
  }

  setFormValue() {
    this.vehicleValuationForm.patchValue({
      // valuatorType: this.vehicleValuationDetails.valuatorType || '',
      // valuatorCode: this.vehicleValuationDetails.valuatorCode || '',
      // valuatorName: this.vehicleValuationDetails.valuatorName || '',
      // vehicleOwnerName:  this.vehicleValuationDetails.vehicleOwnerName || '',
      // vehicleOwnerMobile: this.vehicleValuationDetails.vehicleOwnerMobile || '',
      // vehicleAddress: this.vehicleValuationDetails.vehicleAddress || '',
      // pincode: this.vehicleValuationDetails.pincode || '',
      // gridAmt: this.vehicleValuationDetails.gridAmt || '',
      valuationAmt: this.vehicleValuationDetails.valuationAmt || '',
      valuationDate: this.vehicleValuationDetails.valuationDate ? this.utilityService.getDateFromString(this.vehicleValuationDetails.valuationDate) : '',
      idv: this.vehicleValuationDetails.idv || '',
      idvValidityDate: this.vehicleValuationDetails.idvValidityDate ? this.utilityService.getDateFromString(this.vehicleValuationDetails.idvValidityDate) : '',
      vehicleAvailGrid: this.vehicleValuationDetails.vehicleAvailGrid || '',
      // gridAmount: this.vehicleValuationDetails.gridAmount || '',
      make: this.vehicleValuationDetails.make || '',
      model: this.vehicleValuationDetails.model || '',
      // newUsedAsset: this.vehicleValuationDetails.newUsedAsset || '',
      vehiclePrefixNo: this.vehicleValuationDetails.vehiclePrefixNo || '',
      registrationNo: this.vehicleValuationDetails.registrationNo || '',
      chasisNumber: this.vehicleValuationDetails.chasisNumber || '',
      engineNumber: this.vehicleValuationDetails.engineNumber || '',
      yearOfManufacturer: this.vehicleValuationDetails.yearOfManufacturer || '',
      monthOfManufacturer: this.vehicleValuationDetails.monthOfManufacturer || '',
      ageOfAsset: this.vehicleValuationDetails.ageOfAsset || '',
      sellerShortDesc: this.vehicleValuationDetails.sellerShortDesc || '',
      secondAsset: this.vehicleValuationDetails.secondAsset || '',
      secondVehiclePrefixNo: this.vehicleValuationDetails.secondVehiclePrefixNo || '',
      reRegNumber: this.vehicleValuationDetails.reRegNumber || '',
      regChasisNo: this.vehicleValuationDetails.regChasisNo || '',
      // agricultureProof: this.vehicleValuationDetails.agricultureProof || '',
      fcExpiryDate: this.vehicleValuationDetails.fcExpiryDate ? this.utilityService.getDateFromString(this.vehicleValuationDetails.fcExpiryDate) : '',
      dateofReg: this.vehicleValuationDetails.dateofReg ? this.utilityService.getDateFromString(this.vehicleValuationDetails.dateofReg) : '',
      gvw: this.vehicleValuationDetails.gvw || '',
      preReRegNumber: this.vehicleValuationDetails.preReRegNumber || '',
      interStateVehicle: this.vehicleValuationDetails.interStateVehicle || '',
      duplicateRc: this.vehicleValuationDetails.duplicateRc || '',
      cubicCapacity: this.vehicleValuationDetails.cubicCapacity || '',
      seatingCapacity: this.vehicleValuationDetails.seatingCapacity || '',
      // existingVechicleOwned: this.vehicleValuationDetails.existingVechicleOwned || '',
      // noOfVehicles: this.vehicleValuationDetails.noOfVehicles || '',
      // existingSelfCostAsset: this.vehicleValuationDetails.existingSelfCostAsset || '',
      // total: this.vehicleValuationDetails.total || '',
      // make: this.vehicleValuationDetails.make || '',
      // model: this.vehicleValuationDetails.model || '',
      // year: this.vehicleValuationDetails.year || '',
      // registeredOwner: this.vehicleValuationDetails.registeredOwner || '',
      // registeredOwnerName: this.vehicleValuationDetails.registeredOwnerName || '',
      // vehiclehNoPrefix: this.vehicleValuationDetails.vehiclehNoPrefix || '',
      // vehicleNumber: this.vehicleValuationDetails.vehicleNumber || '',
      // costOfVehicle: this.vehicleValuationDetails.costOfVehicle || '',
    });
  }

  saveUpdateVehicleValuation() {
    const formValues = this.vehicleValuationForm.value;
    console.log("FORMVALUES::::", formValues);
    const data = {
      userId: localStorage.getItem('userId'),
      leadId: this.leadId,
      collateralId: this.colleteralId,
      ...formValues,
      valuationDate: this.utilityService.convertDateTimeTOUTC(formValues.valuationDate, 'DD/MM/YYYY'),
      idvValidityDate: this.utilityService.convertDateTimeTOUTC(formValues.idvValidityDate, 'DD/MM/YYYY'),
      fcExpiryDate: this.utilityService.convertDateTimeTOUTC(formValues.fcExpiryDate, 'DD/MM/YYYY'),
      dateofReg: this.utilityService.convertDateTimeTOUTC(formValues.dateofReg, 'DD/MM/YYYY'),
    };
    // console.log("VALUATION DATE****", formValues.valuationDate);

    if (this.vehicleValuationForm.valid === true) {
      this.vehicleValuationService.saveUpdateVehicleValuation(data).subscribe((res: any) => {
        const response = res;
        console.log("VEHICLE_VALUATION_RESPONSE_SAVE_OR_UPDATE_API", response);
        if (response["Error"] == 0) {
          this.toasterService.showSuccess("Record Saved Successfully", "Valuation");
        }
      });
    } else {
      this.toasterService.showError("Please fill all mandatory fields.", "Valuation");
    }
  }

  onFormSubmit() {
    this.isDirty = true
    this.saveUpdateVehicleValuation();
  }

  onNext() {
    this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
  }

  onBack() {
    this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
  }

}
