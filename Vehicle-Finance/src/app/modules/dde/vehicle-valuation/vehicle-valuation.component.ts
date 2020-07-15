import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LabelsService } from "@services/labels.service";
import { VehicleValuationService } from '../services/vehicle-valuation.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: "app-vehicle-valuation",
  templateUrl: "./vehicle-valuation.component.html",
  styleUrls: ["./vehicle-valuation.component.css"]
})
export class VehicleValuationComponent implements OnInit {
  modelDataForm: FormGroup;

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

  vendorDetails; any = [];
  vendorDetailsData: any = [];
  vendorName: any;

  isModal: boolean;
  isOk: boolean;
  isYes: boolean;
  isDirty: boolean;

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private vehicleValuationService: VehicleValuationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.getLabels();
    this.initForm();
    this.getLOV();
    this.getLeadId();
    this.getCollateralDetailsForVehicleValuation();
    this.getVendorCode();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      (error) => console.log("Vehicle Valuation Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
    console.log("LEADID--->", this.leadId);
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
    });
    console.log(" LOV::::", this.LOV);
  }

  initForm() {
    this.modelDataForm = this.formBuilder.group({
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
        this.colleteralId = this.collateralDetailsData[0].collateralId;
        console.log("COLLETERALID******", this.colleteralId);
        console.log("COLLATERALDETAILSDATA*****", this.collateralDetailsData);
        this.getModelData();
        this.getValuatorStatus();
        this.getValuationReport();
      });
  }

  getValuatorStatus() {
    if (this.collateralDetailsData[0].valuatorStatus === '1') {
      this.valuatorStatus = 'Online';
    } else if (this.collateralDetailsData[0].valuatorStatus === '0') {
      this.valuatorStatus = 'Offline';
    }
  }

  getValuationReport() {
    if (this.collateralDetailsData[0].valuationStatus === 'NOT INITIATED' &&
      this.collateralDetailsData[0].valuatorStatus === null) {
      this.valuationReport = 'Initiate';
    }
    else if (this.collateralDetailsData[0].valuationStatus === 'INITIATED' &&
      this.collateralDetailsData[0].valuatorStatus === '1') {
      this.valuationReport = '------';
    }
    else if (this.collateralDetailsData[0].valuationStatus === 'INITIATED' &&
      this.collateralDetailsData[0].valuatorStatus === '0') {
      this.valuationReport = 'View';
    }
    else if (this.collateralDetailsData[0].valuationStatus === 'SUBMITTED' &&
      this.collateralDetailsData[0].valuatorStatus === '1') {
      this.valuationReport = 'View';
    }
    else if (this.collateralDetailsData[0].valuationStatus === 'SUBMITTED' &&
      this.collateralDetailsData[0].valuatorStatus === '0') {
      this.valuationReport = 'View';
    }
    else if (this.collateralDetailsData[0].valuationStatus === 'RECEIVED' &&
      this.collateralDetailsData[0].valuatorStatus === '1') {
      this.valuationReport = 'View';
    }
    console.log("VALUATIONREPORT****", this.valuationReport);
  }

  getModelData() {
    if (this.collateralDetailsData) {
      this.regNo = this.collateralDetailsData[0].regNo;
      this.make = this.collateralDetailsData[0].make;
      this.model = this.collateralDetailsData[0].model;
      this.address = this.collateralDetailsData[0].address;
      console.log("MODEL-DATA::::", this.regNo, this.make, this.model, this.address);
    }
  }

  getVendorCode() {
    this.vehicleValuationService.getVendorCode().subscribe((res) => {
      //   const response = res;
      this.vendorDetails = res;
      this.vendorDetails.ProcessVariables.vendorDetails.filter((element) => {
        const data = {
          key: element.vendorCode,
          value: element.vendorName
        };
        this.vendorDetailsData.push(data)
      });
      console.log("VENDOR_DETAIL_LIST::::", this.vendorDetailsData);
    });
  }

  onChangeVendorName(event: any) {
    const vendorNameChange = event.target.value;
    this.vendorDetailsData.filter(element => {
      // console.log("ELEMENT:::", element);
      if (element.key == vendorNameChange) {
        this.vendorName = element.value;
      }
      console.log("VENDORNAME::::", this.vendorName);
    });
  }
  initiateVehicleValuation() {
    this.isDirty = true;
    const formValues = this.modelDataForm.getRawValue();
    console.log("FORMVALUES::", formValues);
    const data = {
      userId: localStorage.getItem('userId'),
      collateralId: this.colleteralId,
      ...formValues
    };
    // if(this.modelDataForm.valid === true) {
    //   this.vehicleValuationService.initiateVehicleValuation(data).subscribe( (res) => { 
    //     const response = res;
    //     console.log("RESPONSE_FROM_INITIATE_VEHICLE_VALUATION_API", response);
    //     if (response["Error"] == 0) {
    //       this.toasterService.showSuccess("Vehicle Valuation Model DATA Saved Successfully", "");
    //     } 
    //   });
    // } else {
    //   this.toasterService.showError("Please fill all mandatory fields.", "");
    // }
    if (this.modelDataForm.valid === true) {
      this.vehicleValuationService.initiateVehicleValuation(data).subscribe((res) => {
        const response = res;
        console.log("RESPONSE_FROM_INITIATE_VEHICLE_VALUATION_API", response);
        if (response["Error"] == 0 && response["ProcessVariables"]["error"]["code"] == 0) {

          this.toasterService.showSuccess("Vehicle Valuation Model DATA Saved Successfully",
            "Vehicle Valuation");
          const getData = response["ProcessVariables"]["collateralDetails"]
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
      this.toasterService.showError("Please fill all mandatory fields.", "");
    }

  }

  onClickValuationReport(status) {
    console.log("vStatus", status);
    if (status == 'NOT INITIATED') {
      this.isModal = true;
    }
    else {
      this.isModal = false;
      this.router.navigateByUrl(`/pages/vehicle-valuation/${this.leadId}/valuation/${this.colleteralId}`);
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
  }

  onBack() {
    this.router.navigate([`/pages/dde/${this.leadId}/psl-data`]);

  }

}
