import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LabelsService } from "@services/labels.service";
import { VehicleValuationService } from '../services/vehicle-valuation.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ToggleDdeService } from '@services/toggle-dde.service';


@Component({
  selector: "app-vehicle-valuation",
  templateUrl: "./vehicle-valuation.component.html",
  styleUrls: ["./vehicle-valuation.component.css"]
})
export class VehicleValuationComponent implements OnInit {
  modalDataForm: FormGroup;

  leadId;
  colleteralId;

  labels: any = {};
  LOV: any = [];
  collateralDetailsData: any = [];
  regNo: any;
  model: any;
  make: any;
  address: any;
  valuationReport: string;
  valuatorStatus: string;
  apiValuatorStatus: string;
  apiValuationStatus: string;

  vendorDetails; any = [];
  vendorDetailsData: any = [];
  vendorName: any;

  isModal: boolean;
  isOk: boolean;
  isYes: boolean;
  isDirty: boolean;
  disableSaveBtn: boolean;

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private vehicleValuationService: VehicleValuationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private sharedService: SharedService,
    private toggleDdeService: ToggleDdeService
  ) { }

  ngOnInit() {
    this.getLabels();
    this.initForm();
    this.getLOV();
    this.getLeadId();
    this.getCollateralDetailsForVehicleValuation();
    this.getVendorCode();
    const operationType = this.toggleDdeService.getOperationType();
    if (operationType === '1') {
      this.modalDataForm.disable();
      this.disableSaveBtn = true;
    }
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      // (error) => console.log("Vehicle Valuation Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log("LEADID::", this.leadId);
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
    });
    console.log(" LOV::", this.LOV);
  }

  initForm() {
    this.modalDataForm = this.formBuilder.group({
      remarks: ["",[Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      valuatorCode: ["", [Validators.required]]
    });
  }

  getCollateralDetailsForVehicleValuation() {
    const data = this.leadId;
    this.vehicleValuationService.getCollateralDetailsForVehicleValuation(data).
      subscribe((res: any) => {
        const response = res;
        this.collateralDetailsData = response.ProcessVariables.collateralDetails;
        if(this.collateralDetailsData) {
          this.collateralDetailsData.forEach( (element) => {            
            this.colleteralId = element.collateralId;
            this.apiValuatorStatus = element.valuatorStatus;
            this.apiValuationStatus = element.valuationStatus;
            this.regNo = element.regNo;
            this.make = element.make;
            this.model = element.model;
            this.address = element.address;
            console.log("COLLETERALID::", this.colleteralId);
          });
        }
        // console.log("COLLETERALID::", this.colleteralId);
        console.log("COLLATERALDETAILSDATA::", this.collateralDetailsData);
        // this.getModalData();
        this.getValuatorStatus();
        this.getValuationReport();
      });
  }

  getValuatorStatus() {
    if (this.apiValuatorStatus === '1') {
      this.valuatorStatus = 'Online';
    } else if (this.apiValuatorStatus === '0') {
      this.valuatorStatus = 'Offline';
    }
  }

  getValuationReport() {
    if (this.apiValuationStatus === 'NOT INITIATED' && this.apiValuatorStatus === null) {
      this.valuationReport = 'Initiate';
    }
    else if (this.apiValuationStatus === 'INITIATED' && this.apiValuatorStatus === '1') {
      this.valuationReport = '------';
    }
    else if (this.apiValuationStatus === 'INITIATED' && this.apiValuatorStatus === '0') {
      this.valuationReport = 'View';
    }
    else if (this.apiValuationStatus === 'SUBMITTED' && this.apiValuatorStatus === '1') {
      this.valuationReport = 'View';
    }
    else if (this.apiValuationStatus === 'SUBMITTED' && this.apiValuatorStatus === '0') {
      this.valuationReport = 'View';
    }
    else if (this.apiValuationStatus === 'RECEIVED' && this.apiValuatorStatus === '1') {
      this.valuationReport = 'View';
    }
  }

  // getModalData() {
  //   if(this.collateralDetailsData) {
  //     this.collateralDetailsData.filter( (element) => {
  //       this.regNo = element.regNo;
  //       this.make = element.make;
  //       this.model = element.model;
  //       this.address = element.address;
  //     });
  //   }
  //   console.log("MODEL-DATA::::", this.regNo, this.make, this.model, this.address);
  // }

  getVendorCode() {
    this.vehicleValuationService.getVendorCode().subscribe((res: any) => {
        // const response = res;
      this.vendorDetails = res.ProcessVariables.vendorDetails;
      this.vendorDetails.filter((element) => {
        const data = {
          key: element.vendorCode,
          value: element.vendorName
        };
        this.vendorDetailsData.push(data)
      });
      console.log("VENDOR-LIST::::", this.vendorDetailsData);
    });
  }

  onChangeVendorName(event: any) {
    const vendorNameChange = event.target.value;
    this.vendorDetailsData.filter(element => {
      if (element.key == vendorNameChange) {
        this.vendorName = element.value;
      }
      console.log("VENDOR-NAME::", this.vendorName);
    });
  }
  initiateVehicleValuation() {
    this.isDirty = true;
    const formValues = this.modalDataForm.getRawValue();
    console.log("FORMVALUES::", formValues);
    const data = {
      userId: localStorage.getItem('userId'),
      collateralId: this.colleteralId,
      ...formValues
    };
    if (this.modalDataForm.valid === true) {
      this.vehicleValuationService.initiateVehicleValuation(data).subscribe((res) => {
        const response = res;
        // console.log("RESPONSE_FROM_INITIATE_VEHICLE_VALUATION_API", response);
        if (response["Error"] == 0 && response["ProcessVariables"]["error"]["code"] == 0) {
          this.toasterService.showSuccess("Record Saved Successfully", "Vehicle Valuation");
          const getData = response["ProcessVariables"]["collateralDetails"];
          return this.collateralDetailsData.forEach(element => {
            if (element.collateralId == getData.collateralId) {
              element.valuationStatus = getData.valuationStatus;
              element.valuatorStatus = getData.valuatorStatus;
            }
            console.log("collateralDetailsData", this.collateralDetailsData)
          });

        } else {
          this.toasterService.showError(response["ProcessVariables"]["error"]["message"],
            "Vehicle Valuation");
        }
      });
    } else {
      this.toasterService.showError("Please fill all mandatory fields.", "Vehicle Valuation");
    }

  }

  onClickValuationReport(status, collateralId) {
    console.log("COLLATERAL_ID::", collateralId);
    console.log("vStatus", status);
    let data = this.collateralDetailsData.find((element) => {
      console.log("Element::", element.collateralId === collateralId);
      return element.collateralId === collateralId;
    });
    console.log("DATA::", data);
    if (status == 'NOT INITIATED') {
      this.isModal = true;
      this.regNo= data.regNo;
      this.make = data.make;
      this.model = data.model;
      this.address = data.address;
    }
    else {
      this.isModal = false;
      this.router.navigateByUrl(`/pages/vehicle-valuation/${this.leadId}/valuation/${collateralId}`);
    }
  }

  closeModal() {
    this.isModal = false
  }

  okModal() {
    this.isOk = true;
  }

  yesModal() {
    this.isYes = true;
  }

  onNext() {
    this.router.navigate([`/pages/dde/${this.leadId}/tvr-details`]);
    // this.sharedService.getVehicleValuationNext(true);
    this.sharedService.getPslDataNext(true);
  }

  onBack() {
    this.router.navigate([`/pages/dde/${this.leadId}/psl-data`]);
  }

}
