import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { PslDataService } from '../services/psl-data.service';
import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-psldata',
  templateUrl: './psldata.component.html',
  styleUrls: ['./psldata.component.css']
})
export class PSLdataComponent implements OnInit {
  productCatCode: any;
  pslDependentLOVSData: any;
  LOV: any;
  leadId: number;
  labels: any;
  formValues: any = {};
  data: any = [];
  pslDataForm: any;
  activityChange = '';
  activityLOVS = [];
  detailActivityValues = [];
  detailActivityChangeValues: any;
  endUseValues = [];
  pslLandHolding: any = [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }];
  businessActivity: any = [{ key: 'Not Applicable', value: 'Not Applicable' }];
  pslLandHoldingChange: string;
  landAreaInAcresValue: any;
  plsLandProofChange: any;
  farmerTypeValues: any = [];
  isLandHoldingYes: boolean;
  landProofValues: any = [];
  relationshipWithLandOwner: any = [];
  landOwnerChange: any;
  relationshipWithLandOwnerChange: any;

  typeOfService: any = [];
  purposeOfLoanChange: any;
  pslCategoryValues: any = [];
  pslSubCategoryValues: any = [];
  pslCategoryChange: string;
  pslCategoryData: any;
  pslSubCategoryData: any;
  pslCertificateValues: any = [];
  weakerSectionValues: any = [];
  detailActivityChange: string;
  isGoosManufactured: boolean;
  isInvestmentInEquipment: boolean;
  isInvestmentInPlantMachinery: boolean;
  isDirty: boolean;
  pslData: any;
  disableSaveBtn: boolean;
  loanAmount: any;
  landUnitType = [];
  landAreaInhectare: number;
  submitted = false;


  constructor( private formBuilder: FormBuilder,
               private labelsData: LabelsService,
               private createLeadDataService: CreateLeadDataService,
               private commomLovService: CommomLovService,
               private pslDataService: PslDataService,
               private router: Router,
               private aRoute: ActivatedRoute,
               private toasterService: ToasterService,
               private toggleDdeService: ToggleDdeService,
               private sharedService: SharedService,
               private loanViewService: LoanViewService) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getLeadSectiondata();

  }
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      // (error) => console.log("PSL_DATA Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
      this.getPslData();
    });
    console.log('LEADID::', this.leadId);
  }


  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      this.getDependentDropdownLOV();
      // this.getProofOfInvestmentLOVS();
    });
    console.log('PSL-DATA_LOV::', this.LOV);
  }

  // GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log('PRODUCT_CODE::', this.productCatCode);
  }

  // Get Dependent API LOV for Activity, Detail Activity & Purpose of Loan
  getDependentDropdownLOV() {
    this.pslDataService.getDependentDropdownLOV().subscribe((res: any) => {
      // console.log("RESPONSE FROM APPIYO_SERVER_PSLDATA_Dependent_LOVS_API_RESPONSE", res);
      const response = res.ProcessVariables.pslDataLovObj;
      console.log('PSLDATA_Dependent_LOVS_API', response);
      this.pslDependentLOVSData = response;
      this.getLeadId();
      this.getActivityLOVS();
    });
  }
   // CREATE_PSLDATA_FORMGROUPS
   initForm() {
    this.pslDataForm = this.formBuilder.group({
      activity: ['', Validators.required],

      agriculture: this.formBuilder.group({
        activity: [''],
        detailActivity: ['', Validators.required],
        purposeOfLoan: ['', Validators.required],
        landHolding: ['', Validators.required],
        landOwner: [''],
        relationshipWithLandOwner: [''],
        farmerType: ['', Validators.required],
        landUnitValue: [''],
        landInHectare: [''],
        landUnitType: [''],
        landProof: [''],
        // landProofUpload: [{ value: "", disabled: true }],
        pslCategory: ['', Validators.required],
        pslSubCategory: ['', Validators.required],
        pslCCertificate: ['', Validators.required],
        weakerSection: ['', Validators.required],
      }),

      nonAgriculture: this.formBuilder.group({
        activity: [''],
        detailActivity: ['', Validators.required],
        goodsManufactured: [''],
        typeOfService: ['', Validators.required],
        purposeOfLoan: ['', Validators.required],
        businessActivity: [{ value: '', disabled: true }],
        loanAmount: [''],
        pslCategory: ['', Validators.required],
        pslSubCategory: ['', Validators.required],
        pslCCertificate: ['', Validators.required],
        weakerSection: [{ value: '', disabled: true }],
        uRecessionNo : [''],
        uRegisteredMobileNo : [''],
        uRegisteredEmailId : [''],
        uCertificateId : [''],
      }),


      otherOption: this.formBuilder.group({
        propertyType: [''],
        activity: [''],
        detailActivity: [''],
        goodsManufactured: [''],
        typeOfService: [''],
        purposeOfLoan: [''],
        // purposeOfLoanMsme: [""],
        businessActivity: [''],
        landHolding: [''],
        landOwner: [''],
        relationshipWithLandOwner: [''],
        farmerType: [''],
        landUnitValue: [''],
        landProof: [''],
        // landProofUpload: [""],
        loanAmount: [''],
        proofOfInvestment: [''],
        // proofOfInvestmentUpload: [""],
        nameOfCa: [''],
        nameOfCaFirm: [''],
        caRegistrationNumber: [''],
        udinNo: [''],
        caCertifiedAmount: [''],
        otherInvestmentCost: [''],
        totalInvestmentCost: [''],
        investmentInEquipment: [''],
        investmentInPlantMachinery: [''],
        totalInvestment: [''],
        propertyLocatedCity: [''],
        propertyLocation: [''],
        propertyPincode: [''],
        landAmount: [''],
        landCost: [''],
        constructionCost: [''],
        totalPropertyCost: [''],
        registrationCost: [''],
        pslConsiderationCost: [''],
        pslCategory: [''],
        pslCategoryMsme: [''],
        pslCategoryHos: [''],
        pslSubCategory: [''],
        pslSubCategoryMsme: [''],
        pslCCertificate: [''],
        pslCertificateMsme: [''],
        pslCertificateHos: [''],
        weakerSection: [''],
        // weakerSection: [""],
      }),
    });
  }
  onActivityChange(event) {
    const changeEvent = event;
    console.log('activity event', changeEvent);
    this.activityChange = changeEvent;
    this.getDetailActivity(changeEvent);
    this.applyMandatoryToActivity(changeEvent);
  }
  // GET LOV of ACTIVITY DROPDOWN
  getActivityLOVS() {
    this.pslDependentLOVSData.map((element) => {
      const data = {
        key: element.activityId,
        value: element.activityName,
      };
      this.activityLOVS.push(data);
      // To filter unique value in Array
      // tslint:disable-next-line: prefer-const
      let activityObject = {};
      const activityData = [];
      // console.log(this.activityLOVS);
      this.activityLOVS.forEach((element) => {
        if (!activityObject[element.key]) {
          activityObject[element.key] = true;
          activityData.push(element);
        }
      });
      this.activityLOVS = activityData;
      // console.log('ACTIVITYLOVS******', this.activityLOVS);
    });
  }
  getDetailActivity(activity) {
    console.log('psl lovs', this.pslDependentLOVSData);
    this.detailActivityValues = [];
    this.detailActivityChangeValues = [];
    if (activity !== '7PSLACTVTY') {
    this.pslDependentLOVSData.map((element) => {
      if (element.activityId === activity) {
        // console.log("RELATED_DETAILACTIVITY_NAME----", element.dltActivityName);
        const data = {
          key: element.dltActivityId,
          value: element.dltActivityName,
        };
        this.detailActivityValues.push(data);
      }
      // console.log("DETAIL_ACTIVITY_VALUES---", this.detailActivityValues);
    });
    // To filter unique value from Array
    let detailActivityObject = {};
    const detailActivityData = [];
    this.detailActivityValues.forEach((element) => {
      if (!detailActivityObject[element.key]) {
        detailActivityObject[element.key] = true;
        detailActivityData.push(element);
      }
    });
    // console.log("DETAILACTIVITY_DATA", detailActivityData);
    this.detailActivityChangeValues = detailActivityData;
    this.pslDataForm.controls.nonAgriculture.enable();
    this.pslDataForm.controls.nonAgriculture.patchValue({
      loanAmount: this.loanAmount
    });
    this.pslDataForm.controls.nonAgriculture.controls.loanAmount.disable();
    // this.applyMandatoryToActivity(activity);
  } else if (activity === '7PSLACTVTY') {
    this.onChangeDetailActivity(null);
    const resetControl =  this.pslDataForm.get('nonAgriculture') as FormGroup;
    resetControl.controls.loanAmount.reset();
    const control = this.pslDataForm.get('nonAgriculture').controls as FormGroup;
    console.log('controls in non-agriculture', control);
    // control['detailActivity'].disable();
    // tslint:disable-next-line: forin
    for (const key in control) {
      console.log('key in controls', key);
      if (key !== 'activity' && key !== 'purposeOfLoan' && key !== 'pslCategory' && key !== 'pslSubCategory') {
        control[key].reset();
        control[key].clearValidators();
        control[key].updateValueAndValidity();
        control[key].disable();
      }
    }
    // this.applyMandatoryToActivity(activity);
  }
  }
  onChangeDetailActivity(event2) {
    if (event2 != null) {
      const detailActivityChange = event2 ;
    // }

      this.endUseValues = [];
      console.log('details activity', detailActivityChange);
    // if (event2 != null) {
      this.pslDependentLOVSData.map((element) => {
        if (element.dltActivityId === detailActivityChange) {
          const data = {
            key: element.endUseId,
            value: element.endUseName,
          };

          // console.log('RELATED_ENDUSE_NAME --', data);
          this.endUseValues.push(data);
        }
      });
      this.getLovForDetailActivity(detailActivityChange);
    } else {
      this.endUseValues = [];
      this.pslDependentLOVSData.map((element) => {
        if (element.dltActivityId === null) {
          const data = {
            key: element.endUseId,
            value: element.endUseName,
          };

          this.endUseValues.push(data);
        }
      });

      // if (this.detailActivityChange === null) {
      console.log('this.LOV.LOVS.pslCategory', this.LOV.LOVS.pslCategory);
      this.LOV.LOVS.pslCategory.filter((element) => {
          if (element.key === '4PSLCAT') {
            this.pslCategoryData = [{ key: element.key, value: element.value }];
            this.pslCategoryValues = this.pslCategoryData;
            this.formValues.pslCategory = this.pslCategoryData[0].key;
          }
        });
      this.pslDataForm.get('nonAgriculture').patchValue ({
          pslCategory: this.pslCategoryData[0].key
        });
      console.log('this.LOV.LOVS.pslSubCategory', this.LOV.LOVS.pslSubCategory);
      this.LOV.LOVS.pslSubCategory.filter((element) => {
          if (element.key === '10PSLSUBCAT') {
            this.pslSubCategoryData = [{ key: element.key, value: element.value }];
            this.pslSubCategoryValues = this.pslSubCategoryData;
            this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
          }
        });
      this.pslDataForm.get('nonAgriculture').patchValue ({
        pslSubCategory: this.pslSubCategoryData[0].key
        });
      // console.log('this.LOV.LOVS.pslCertificate', this.LOV.LOVS.pslCertificate);
      // this.LOV.LOVS.pslCertificate.filter((element) => {
      //     if (element.key === '3PSLCRTFCTE') {
      //       this.data = [{ key: element.key, value: element.value }];
      //       this.pslCertificateValues = this.data;
      //       this.formValues.pslCCertificate = this.data[0].key;
      //     }
      //   });
      // }

    }
    // this.endUseValues.forEach((element) => {
    //   console.log('end use duplicates', element);

    //    });
    // filtering duplicates from end user values(purpose of loan lov)
    this.endUseValues = Object.values(this.endUseValues.reduce((acc, cur) => Object.assign(acc, {[cur.key]: cur}), {}));
  }
   // CHANGE OPTION IN LAND HOLDING
   onChangePslLandHolding(event: any) {
    this.pslLandHoldingChange = event;
    // console.log("PSL_LANDHOLDING_CHANGE_ID-----", this.pslLandHoldingChange);
    this.onSelectPslLandHolding();
    // console.log("FARMER_TYPE_VALUES---", this.farmerTypeValues);
  }
   // SET VALIDATION AND SET LOV FOR PSL LAND HOLDING
   onSelectPslLandHolding() {
    // TO_CLEAR_PREVIOUS_FORMCONTROLS_VALUES_IF_LANDHOLDING_CHANGES
    this.pslDataForm.get('agriculture').patchValue({
      // purposeOfLoan: "",
      landOwner: '',
      relationshipWithLandOwner: '',
      landProof: '',
      farmerType: '',
      landUnitValue: 0,
      pslSubCategory: '',
      pslCCertificate: '',
      weakerSection: '',
    });
    this.pslDataForm.get('agriculture.landUnitValue').reset();
    this.pslDataForm.get('agriculture.landInHectare').reset();
    this.farmerTypeValues = [];
    this.weakerSectionValues = [];
    if (this.pslLandHoldingChange === '1') {
      this.LOV.LOVS.pslFarmerType.filter((element) => {
        if (element.key === '1PSLFARMER' || element.key === '2PSLFARMER' ||
          element.key === '3PSLFARMER' || element.key === '4PSLFARMER') {
          const data = { key: element.key, value: element.value };
          this.farmerTypeValues.push(data);
          // console.log("FarmerTypeValues_IF_YES*****", this.farmerTypeValues);
        }
      });
      this.isLandHoldingYes = true;
      this.pslDataForm
        .get('agriculture.landUnitValue')
        .setValidators([Validators.required]);
      this.pslDataForm.get('agriculture.landUnitValue').updateValueAndValidity();
      this.pslDataForm
        .get('agriculture.landInHectare')
        .setValidators([Validators.required]);
      this.pslDataForm.get('agriculture.landInHectare').updateValueAndValidity();
      this.pslDataForm
        .get('agriculture.landProof')
        .setValidators([Validators.required]);
      this.pslDataForm.get('agriculture.landProof').updateValueAndValidity();
      this.pslDataForm
        .get('agriculture.landOwner')
        .setValidators([Validators.required]);
      this.pslDataForm.get('agriculture.landOwner').updateValueAndValidity();
      this.pslDataForm
        .get('agriculture.relationshipWithLandOwner')
        .setValidators([Validators.required]);
      this.pslDataForm.get('agriculture.relationshipWithLandOwner').updateValueAndValidity();
    } else if (this.pslLandHoldingChange === '0') {
      this.LOV.LOVS.pslFarmerType.filter((element) => {
        if (element.key === '5PSLFARMER' || element.key === '6PSLFARMER') {
          const data = { key: element.key, value: element.value };
          this.farmerTypeValues.push(data);
          console.log('FarmerTypeValues_IF_NO>>>>', this.farmerTypeValues);
        }
      });
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === '3PSLSUBCAT') {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === '3PSLCRTFCTE') {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key != '1PSLWKRSCT') {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
      this.isLandHoldingYes = false;
      // this.landAreaInAcresValue = 0;
      this.pslDataForm.get('agriculture.landUnitValue').reset();
      this.pslDataForm.get('agriculture.landInHectare').reset();
      this.plsLandProofChange = '';
      this.landOwnerChange = '';
      this.relationshipWithLandOwnerChange = '';
      // console.log("VALUES_IF_LANDHOLDING_AS_NO::::",this.landAreaInAcresValue, this.plsLandProofChange,
      //              this.landOwnerChange, this.relationshipWithLandOwnerChange);
      this.pslDataForm.get('agriculture.landUnitValue').clearValidators();
      this.pslDataForm.get('agriculture.landUnitValue').updateValueAndValidity();
      this.pslDataForm.get('agriculture.landInHectare').clearValidators();
      this.pslDataForm.get('agriculture.landInHectare').updateValueAndValidity();
      this.pslDataForm.get('agriculture.landProof').clearValidators();
      this.pslDataForm.get('agriculture.landProof').updateValueAndValidity();
      this.pslDataForm.get('agriculture.landOwner').clearValidators();
      this.pslDataForm.get('agriculture.landOwner').updateValueAndValidity();
      this.pslDataForm.get('agriculture.relationshipWithLandOwner').clearValidators();
      this.pslDataForm.get('agriculture.relationshipWithLandOwner').updateValueAndValidity();
      // TO AUTOPOPULATE DATA_PSLSUBCATEGORY||PSLCERTIFICATE||WEAKERSECTION
      if (this.pslSubCategoryValues.length == 1) {
        this.pslDataForm.get('agriculture').patchValue({
          pslSubCategory: this.pslSubCategoryValues[0].key
        });
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          pslSubCategory: ''
        });
      }
      if (this.pslCertificateValues.length == 1) {
        this.pslDataForm.get('agriculture').patchValue({
          pslCCertificate: this.pslCertificateValues[0].key
        });
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          pslCCertificate: ''
        });
      }
      if (this.weakerSectionValues.length == 1) {
        this.pslDataForm.get('agriculture').patchValue({
          weakerSection: this.weakerSectionValues[0].key
        });
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          weakerSection: ''
        });
      }
    }
  }
  setValueForPslCategoryByLandArea() {
    this.weakerSectionValues = [];
    if ( this.landAreaInAcresValue <= 1 && this.landAreaInAcresValue != null ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === '1PSLSUBCAT') {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === '2PSLCRTFCTE') {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key === '1PSLWKRSCT') {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
    } else if (
      this.landAreaInAcresValue > 1 &&
      this.landAreaInAcresValue <= 2
    ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === '2PSLSUBCAT') {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === '1PSLCRTFCTE') {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key === '1PSLWKRSCT') {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
    } else if (this.landAreaInAcresValue > 2) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === '3PSLSUBCAT') {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === '3PSLCRTFCTE') {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key != '1PSLWKRSCT') {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
    } else {
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key != '1PSLWKRSCT') {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
    }
    // TO AUTO-POPULATE PSL-SUBCATEGORY||PSL-CERTIFICATE||PSL-WEAKERSECTION DATA
    if (this.pslSubCategoryValues.length == 1) {
      this.pslDataForm.get('agriculture').patchValue({
        pslSubCategory: this.pslSubCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get('agriculture').patchValue({
        pslSubCategory: ''
      });
    }
    if (this.pslCertificateValues.length == 1) {
      this.pslDataForm.get('agriculture').patchValue({
        pslCCertificate: this.pslCertificateValues[0].key
      });
    } else {
      this.pslDataForm.get('agriculture').patchValue({
        pslCCertificate: ''
      });
    }
    if (this.weakerSectionValues.length == 1) {
      this.pslDataForm.get('agriculture').patchValue({
        weakerSection: this.weakerSectionValues[0].key
      });
    } else {
      this.pslDataForm.get('agriculture').patchValue({
        weakerSection: ''
      });
    }
  }
  // CHANGE IN LAND AREA VALUE
  onLandAreaChange(event: any) {
    let landAreaChange = event.target.value;
    this.setValueForPslCategoryByLandArea();
  }
   // FUNCTION TO CHNAGE LOV IN LAND OWNER
   onChangeLandOwner(event: any) {
    this.landOwnerChange = event.target.value;
    console.log('LandOwner_Change::::', this.landOwnerChange);
    this.setValueForLandOwner();
  }

  // SET LOV FOR LAND OWNER
  setValueForLandOwner() {
    this.relationshipWithLandOwner = [];
    if (this.landOwnerChange === 'APPAPPRELLEAD') {
      this.LOV.LOVS.relationship.filter((element) => {
        if (element.key === '5RELATION') {
          const data = { key: element.key, value: element.value };
          this.relationshipWithLandOwner.push(data);
        }
      });
    } else {
      this.LOV.LOVS.relationship.filter((element) => {
        if (element.key != '5RELATION') {
          const data = { key: element.key, value: element.value };
          this.relationshipWithLandOwner.push(data);
        }
      });
    }
    // AUTOPOPULATE_RELATIONSHIPWITHLANDOWNER_IF_LANDOWNER_AS_APPLICANT
    if (this.relationshipWithLandOwner.length == 1) {
      this.pslDataForm.get('agriculture').patchValue({
        relationshipWithLandOwner: this.relationshipWithLandOwner[0].key
      });
    } else {
      this.pslDataForm.get('agriculture').patchValue({
        relationshipWithLandOwner: ''
      });
    }
  }

  // CHANGE LOV IN RELATIONSGIP WITH LAND OWNER
  onChangeRelationshipLandOwner(event: any) {
    this.relationshipWithLandOwnerChange = event.target.value;
    console.log('relationshipWithLandOwnerChange::::', this.relationshipWithLandOwnerChange);
  }
  getLovForDetailActivity(event) {
    this.detailActivityChange = null;
    this.detailActivityChange = event;
    // CLEAR_PREVIOUS_VALUES_OF_FORMCONTROLS_IF_DETAIL-ACTIVITY_CHANGES
    this.pslDataForm.get('agriculture').patchValue({
      purposeOfLoan: '',
      landHolding: '',
      landOwner: '',
      landUnitValue: '',
      landInHectare: '',
      relationshipWithLandOwner: '',
      farmerType: '',
      landProof: '',
      pslSubCategory: '',
      pslCCertificate: '',
      weakerSection: '',
    });
    this.pslDataForm.get('agriculture.landUnitValue').reset();
    this.pslDataForm.get('agriculture.landInHectare').reset();
    this.pslDataForm.get('nonAgriculture').patchValue({
      purposeOfLoan: '',
      goodsManufactured: '',
      typeOfService: '',
      proofOfInvestment: '',
      pslSubCategory: '',
      pslCCertificate: '',

    });
    // WHEN DETAIL-ACTIVITY CHANGES RESET VALUES
    // this.pslDataForm.get('nonAgriculture.otherInvestmentCost').reset();
    // this.pslDataForm.get('nonAgriculture.totalInvestmentCost').reset();
    // PSL_DEPENDENT_LOV_OPERATION_DETAIL-ACTIVITY
    // this.pslDependentLOVSData.map((element) => {
    //   if (element.dltActivityId === this.detailActivityChange) {
    //     const data = {
    //       key: element.endUseId,
    //       value: element.endUseName,
    //     };
    //     console.log('RELATED_ENDUSE_NAME --', data);
    //     this.endUseValues.push(data);
    //   }
    // });

    // If DETAIL_ACTIVITY AS ALLIED ACTIVITY
    if (this.detailActivityChange === '2PSLDTLACTVTY') {
      this.pslLandHolding = [{ key: 0, value: 'No' }];

      this.landAreaInAcresValue = 0;
      this.pslDataForm.get('agriculture.landUnitValue').reset();
      this.pslDataForm.get('agriculture.landUnitType').reset();
      this.pslDataForm.get('agriculture.landInHectare').reset();

      this.isLandHoldingYes = false; // When selected "Allied Activities" in Detail_Activity
      // this.pslDataForm.controls.agriculture.patchValue({
      //   landHolding: this.pslLandHolding[0].key
      // });
      // IF_DETAILS-ACTIVITY-ALLIED ACTIVITIES--> AUTOMATICALLY PSLSUBCATEGORY AS OTHER-FARMER
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === '3PSLSUBCAT') {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === '3PSLCRTFCTE') {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key != '1PSLWKRSCT') {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
      // AUTOPOPULATE_PSLSUBCATEGORY||PSLCERTIFICATE||WEAKERSECTION DATA_IF_ALLIED-ACTIVITY_SELECTED
      if (this.pslSubCategoryValues.length == 1) {
        this.pslDataForm.get('agriculture').patchValue({
          pslSubCategory: this.pslSubCategoryValues[0].key
        });
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          pslSubCategory: ''
        });
      }
      if (this.pslCertificateValues.length == 1) {
        this.pslDataForm.get('agriculture').patchValue({
          pslCCertificate: this.pslCertificateValues[0].key
        });
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          pslCCertificate: ''
        });
      }
      if (this.weakerSectionValues.length == 1) {
        this.pslDataForm.get('agriculture').patchValue({
          weakerSection: this.weakerSectionValues[0].key
        });
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          weakerSection: ''
        });
      }
      if (this.pslLandHolding.length == 1) {
        // this.pslDataForm.controls.agriculture.patchValue({
        //   landHolding : this.pslLandHolding[0].key
        // });
        this.pslDataForm.get('agriculture').patchValue({
          landHolding : this.pslLandHolding[0].key
        });
        this.onChangePslLandHolding('0');
      } else {
        this.pslDataForm.get('agriculture').patchValue({
          landHolding : ''
        });
      }
    } else if (this.detailActivityChange === '1PSLDTLACTVTY') {
      this.pslLandHolding = [
        { key: 1, value: 'Yes' },
        { key: 0, value: 'No' },
      ];
      this.isLandHoldingYes = true;
    }
    // DETAIL_ACTIVITY_AS_AGRICULTURE_OR_ALLIED-ACTIVITIES
    if (
      this.detailActivityChange === '1PSLDTLACTVTY' ||
      this.detailActivityChange === '2PSLDTLACTVTY'
    ) {
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === '1PSLCAT') {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
    }
    // IF DETAIL-ACTIVITY AS "MANUFACTURING"
    if (this.detailActivityChange === '5PSLDTLACTVTY') {
      this.isInvestmentInPlantMachinery = true;
      // this.investmentInEquipmentValue = 0;
      // this.pslDataForm.get('nonAgriculture.investmentInEquipment').reset();
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === '3PSLCAT') {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
      this.pslSubCategoryData = [];
      this.pslSubCategoryValues = [];
      this.LOV.LOVS.pslSubCategory.filter((element) => {

        if (element.key === '4PSLSUBCAT' || element.key === '5PSLSUBCAT' || element.key === '6PSLSUBCAT') {
          // this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          // this.pslSubCategoryValues = this.pslSubCategoryData;
          // this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
          const data = {
            key: element.key,
            value: element.value
          };
          // this.pslSubCategoryData.push(data);
          this.pslSubCategoryValues.push(data);
        }
      });
      // console.log("PSLSUBCAT_KEY::", this.pslSubCategoryData[0].key);
      // this.LOV.LOVS.pslCertificate.filter((element) => {
      //   if (element.key === '4PSLCRTFCTE') {
      //     this.data = [{ key: element.key, value: element.value }];
      //     this.pslCertificateValues = this.data;
      //     this.formValues.pslCCertificate = this.data[0].key;
      //   }
      // });
      this.typeOfService = [{ key: 'Not Applicable', value: 'Not Applicable' }];
      this.pslDataForm.controls.nonAgriculture.patchValue({
        typeOfService : this.typeOfService[0].key
      });
      this.f.controls.typeOfService.disable();
      this.pslDataForm
        .get('nonAgriculture.goodsManufactured')
        .setValidators([Validators.required]);
      this.pslDataForm
        .get('nonAgriculture.goodsManufactured')
        .updateValueAndValidity();
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInPlantAndMachinery')
      //   .setValidators([Validators.required]);
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInPlantAndMachinery')
      //   .updateValueAndValidity();
    } else {
      this.isInvestmentInPlantMachinery = false;
      this.pslDataForm
        .get('nonAgriculture.goodsManufactured')
        .clearValidators();
      this.pslDataForm
        .get('nonAgriculture.goodsManufactured')
        .updateValueAndValidity();
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInPlantAndMachinery')
      //   .clearValidators();
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInPlantAndMachinery')
      //   .updateValueAndValidity();
    }
    // IF DETAIL-ACTIVITY AS "SERVICE"
    if (this.detailActivityChange === '6PSLDTLACTVTY') {
      const data = this.LOV.LOVS.typeOfService;
      this.typeOfService = data;
      this.isGoosManufactured = false;
      this.isInvestmentInEquipment = true;
      this.f.controls.typeOfService.enable();
      // this.investmentInPlantMachineryValue = 0;
      // this.pslDataForm.get('nonAgriculture.investmentInPlantAndMachinery').reset();
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === '2PSLCAT') {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
      this.pslSubCategoryData = [];
      this.pslSubCategoryValues = [];
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === '6PSLSUBCAT' || element.key === '4PSLSUBCAT' || element.key === '5PSLSUBCAT') {
          // tslint:disable-next-line: no-shadowed-variable
          const data = {
            key: element.key,
            value: element.value
          };
          // this.pslSubCategoryData.push(data);
          this.pslSubCategoryValues.push(data);
          // this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      // console.log("PSLSUBCAT_KEY::", this.pslSubCategoryData[0].key);

      // this.pslDataForm
      //   .get('nonAgriculture.investmentInEquipment')
      //   .setValidators([Validators.required]);
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInEquipment')
      //   .updateValueAndValidity();
    } else {
      this.typeOfService = [{ key: 'Not Applicable', value: 'Not Applicable' }];
      this.isGoosManufactured = true;
      this.isInvestmentInEquipment = false;
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInEquipment')
      //   .clearValidators();
      // this.pslDataForm
      //   .get('nonAgriculture.investmentInEquipment')
      //   .updateValueAndValidity();
    }

    if (this.pslCategoryValues.length == 1) {
      this.pslDataForm.get('nonAgriculture').patchValue({
        pslCategory: this.pslCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get('nonAgriculture').patchValue({
        pslCategory: ''
      });
    }
    if (this.pslCategoryValues.length == 1) {
      this.pslDataForm.get('agriculture').patchValue({
        pslCategory: this.pslCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get('agriculture').patchValue({
        pslCategory: ''
      });
    }
    console.log('psl values', this.pslCategoryValues);
    // if( )
  }
  // SAVE/UPDATE FUNCTION FOR PSL-DATA FORM
  saveOrUpdatePslData() {
    // this.agriculture = this.pslDataForm.get('agriculture');
    // this.non = this.pslDataForm.get(
    //   'microSmallAndMediumEnterprises'
    // );
    // FOR AGRICULTURE FORM
    if (this.activityChange === '1PSLACTVTY') {
      this.isDirty = true;
      this.formValues = this.pslDataForm.get('agriculture').value;
      console.log('FormValues::', this.formValues);
      // IF_PSL-CERTIFICATE_NOT_FOUND
      if (!this.formValues.pslCCertificate) {
        this.toasterService.showError('Please fill all mandatory fields.', 'PSL DATA');
        return;
      }
      this.formValues.activity = this.activityChange;
      this.formValues.pslCategory = this.pslCategoryData[0].key;
      this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
      this.formValues.pslCCertificate = this.data[0].key;
      this.formValues.landInHectare = Number( this.formValues.landInHectare);
      this.formValues.landUnitValue = Number( this.formValues.landUnitValue);
      this.formValues.weakerSection = this.convertTocsv();
      const data = {
        userId: localStorage.getItem('userId'),
        leadId: this.leadId,
        pslData: {
          ...this.formValues,
          // landArea: Number(this.formValues.landArea),
          // landHolding: Number(this.formValues.landHolding)
        },
      };
      if (this.pslDataForm.controls.agriculture.valid === true) {

        this.pslDataService.saveOrUpadtePslData(data).subscribe((res: any) => {
          const response = res;
          // this.pslId = response.ProcessVariables.pslId;
          // console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);
          if (response['Error'] == '0' && response['ProcessVariables'].error['code'] == '0') {
            this.toasterService.showSuccess('Record Saved Successfully', 'PSL DATA');
          } else {
            this.toasterService.showError(response['ProcessVariables'].error['message'], 'PSL DATA');
          }
        });
      } else {
        this.toasterService.showError('Please fill all mandatory fields.', 'PSL DATA');
      }
    } else if (this.activityChange !== '1PSLACTVTY' ) {
      this.applyMandatoryToActivity(this.activityChange);
      this.submitted = true;
      this.formValues = this.pslDataForm.get('nonAgriculture').value;
      console.log('FormValues::', this.formValues);
      console.log('psl form', this.pslDataForm);
      // IF_PSL-CERTIFICATE_NOT_FOUND
      if (this.activityChange !== '7PSLACTVTY') {
      this.isDirty = true;
      if (!this.formValues.pslCCertificate) {
        this.toasterService.showError('Please fill all mandatory fields.', 'PSL DATA');
        return;
      }
      this.formValues.activity = this.activityChange;
      this.formValues.pslCCertificate = this.data[0].key;
      this.formValues.pslCategory = this.pslCategoryData[0].key;
      this.formValues.pslSubCategory = this.formValues.pslSubCategory ;
      this.formValues.typeOfService = this.typeOfService[0].key;
      this.formValues.purposeOfLoan = this.purposeOfLoanChange;
      } else {
      if (this.pslDataForm.controls.nonAgriculture.invalid) {
        this.isDirty = true;
        this.toasterService.showError('Please fill all mandatory fields.', 'PSL DATA');
        return;
      }
      this.formValues.activity = this.activityChange;
        // this.formValues.pslCCertificate = this.data[0].key;
      this.formValues.pslCategory = this.formValues.pslCategory;
      this.formValues.pslSubCategory = this.formValues.pslSubCategory;
        // this.formValues.typeOfService = this.typeOfService[0].key;
      this.formValues.purposeOfLoan = this.purposeOfLoanChange;
      }

      // this.formValues.totalInvestmentCost = this.totalInvestmentCost;
      const data = {
        userId: localStorage.getItem('userId'),
        leadId: this.leadId,
        pslData: {
          ...this.formValues,
          // loanAmount: Number(this.formValues.loanAmount),
          // udinNo: Number(this.formValues.udinNo),
          // caCertifiedAmount: Number(this.formValues.caCertifiedAmount),
          // otherInvestmentCost: Number(this.formValues.otherInvestmentCost),
          // totalInvestmentCost: Number(this.formValues.totalInvestmentCost),
          // investmentInEquipment: Number(this.formValues.investmentInEquipment),
          // investmentInPlantAndMachinery: Number(this.formValues.investmentInPlantAndMachinery)
        },
      };

      // const data = this.pslDataForm.get('microSmallAndMediumEnterprises').value;
      if (this.pslDataForm.controls.nonAgriculture.valid === true) {
        this.pslDataService.saveOrUpadtePslData(data).subscribe((res: any) => {
          const response = res;
          // console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);
          if (response['Error'] == 0 && response['ProcessVariables'].error['code'] == '0') {
            this.toasterService.showSuccess('Record Saved Successfully', 'PSL DATA');
          } else {
            this.toasterService.showError(response['ProcessVariables'].error['message'], 'PSL DATA');
          }
        });
      } else {
        this.toasterService.showError('Please fill all mandatory fields.', 'PSL DATA');
      }
    }
  }
  // LOV CHANGE IN LAND PROOF
  onChangePslLandProof(event: any) {
    this.plsLandProofChange = event.target.value;
    console.log('this.plsLandProofChange', this.plsLandProofChange);
  }
// PURPOSE OF LOAN CHANGE BASED ON DETAIL-ACTIVITY
onChangePurposeOfLoan(event: any) {
  this.purposeOfLoanChange = event.target.value;
  console.log('purposeOfLoanChange', this.purposeOfLoanChange);
}
onChangeWeakerSection(event: any) {
  this.formValues.weakerSection = event.target.value;
  console.log('weakerSectionChange::', this.formValues.weakerSection);
}
  // FORM_SUBMIT_FUNCTION
  onFormSubmit() {
    this.saveOrUpdatePslData();
  }

  // NAVIGATE_NEXT_BASED_ON_PRODUCT_CODE
  navigateNext() {
    if (this.productCatCode != 'NCV') {
      this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
      this.sharedService.getPslDataNext(false);
    } else if (this.productCatCode == 'NCV') {
      this.router.navigate([`/pages/dde/${this.leadId}/tvr-details`]);
      this.sharedService.getPslDataNext(true);

    }
  }

  onBack() {
    this.router.navigate([`/pages/dde/${this.leadId}/income-details`]);
  }
   // CALLING_GET_API_FOR_PSL-DATA&&PATCHING_VALUES
   getPslData() {
    const data = this.leadId;
    this.pslDataService.getPslData(data).subscribe((res: any) => {
      // console.log("RESPONSE FROM APPIYO_SERVER_GET_PSL_DATA_API", res);
      const response = res;
      this.pslData = response.ProcessVariables.pslData;
      this.loanAmount = response.ProcessVariables.loanAmount;
      console.log('PSLDATA::::', this.pslData);
      response.ProcessVariables.hectaresConversionDetails.map((element) => {
      const body = {
        key: element.landUnit,
        value: element.landUnitDesc,
        factor: element.multiplicationFactor
      };
      this.landUnitType.push(body);
      });
      if (this.pslData === null) {
        setTimeout(() => {
          const operationType = this.toggleDdeService.getOperationType();
          if (operationType) {
            this.pslDataForm.disable();
            this.disableSaveBtn = true;
          }
          if (this.loanViewService.checkIsLoan360()) {
            this.pslDataForm.disable();
            this.disableSaveBtn = true;
          }
        })
        return;
      }
      const activity = this.pslData.activity;
      this.activityChange = activity;
      // this.onChangeDetailActivity(activity);
      const dltActivity = this.pslData.detailActivity;
      // this.selectFormGroup();
      this.detailActivityChange = dltActivity;
      // this.getLovForDetailActivity();
      this.getDetailActivity(this.activityChange);
      if(this.activityChange !== '7PSLACTVTY') {
        this.onChangeDetailActivity(dltActivity);
      } else {
        this.onChangeDetailActivity(null);
      }

      if (activity === '1PSLACTVTY') {
        this.pslLandHoldingChange = this.pslData.landHolding;
        this.onSelectPslLandHolding();
        this.landOwnerChange = this.pslData.landOwner;
        this.setValueForLandOwner();
        setTimeout(() => {
          this.landAreaInAcresValue = this.pslData.landUnitValue;
          this.setValueForPslCategoryByLandArea();
          this.pslDataForm.patchValue({
            activity: this.activityChange
          });
          this.pslDataForm.patchValue({
            // activity: this.pslData.activityChange,
            agriculture: {
              activity: this.pslData.activity,
              detailActivity: this.pslData.detailActivity,
              purposeOfLoan: this.pslData.purposeOfLoan,
              landHolding: this.pslData.landHolding,
              landOwner: this.pslData.landOwner,
              relationshipWithLandOwner: this.pslData.relationshipWithLandOwner,
              farmerType: this.pslData.farmerType,
              landUnitValue: this.pslData.landUnitValue,
              landUnitType: this.pslData.landUnitType,
              landInHectare: this.pslData.landInHectare,
              landProof: this.pslData.landProof,
              // landProofUpload: this.pslData.landProofUpload,
              pslCategory: this.pslData.pslCategory,
              pslSubCategory: this.pslData.pslSubCategory,
              pslCCertificate: this.pslData.pslCCertificate,
              weakerSection: this.csvToArray(this.pslData.weakerSection),
            },
          });
          this.onChangelandUnitType();
        });
        setTimeout(() => {
          const operationType = this.toggleDdeService.getOperationType();
          if (operationType) {
            this.pslDataForm.disable();
            this.disableSaveBtn = true;
          }
        })
      } else if (activity === '5PSLACTVTY' || activity === '6PSLACTVTY' ) {
        this.onChangePslSubcategory(this.pslData.pslSubCategory);
        setTimeout(() => {
            this.pslDataForm.patchValue({
              activity: this.activityChange
            });
            this.pslDataForm.patchValue({
              // activity: this.pslData.activity,
              nonAgriculture: {
                activity: this.pslData.activity,
                detailActivity: this.pslData.detailActivity,
                goodsManufactured: this.pslData.goodsManufactured,
                typeOfService: this.pslData.typeOfService,
                purposeOfLoan: this.pslData.purposeOfLoan,
                loanAmount: this.loanAmount,
                pslCategory: this.pslData.pslCategory,
                pslSubCategory: this.pslData.pslSubCategory,
                pslCCertificate: this.pslData.pslCCertificate,
                uRecessionNo : this.pslData.uRecessionNo,
                uRegisteredMobileNo :  this.pslData.uRegisteredMobileNo,
                uRegisteredEmailId :  this.pslData.uRegisteredEmailId,
              },
            });

        });
      } else if (activity === '7PSLACTVTY') {
        setTimeout(() => {
          this.pslDataForm.patchValue({
            activity: this.activityChange
          });
          this.pslDataForm.patchValue({
            // activity: this.pslData.activity,
            nonAgriculture: {
              // activity: this.pslData.activity,
              // detailActivity: this.pslData.detailActivity,
              // goodsManufactured: this.pslData.goodsManufactured,
              // typeOfService: this.pslData.typeOfService,
              purposeOfLoan: this.pslData.purposeOfLoan,
              loanAmount: this.loanAmount,
              pslCategory: this.pslData.pslCategory,
              pslSubCategory: this.pslData.pslSubCategory,
              // pslCCertificate: this.pslData.pslCCertificate,
              // uRecessionNo : this.pslData.uRecessionNo,
              // uRegisteredMobileNo :  this.pslData.uRegisteredMobileNo,
              // uRegisteredEmailId :  this.pslData.uRegisteredEmailId,
            },
          });

      });
      }
      setTimeout(() => {
        const operationType = this.toggleDdeService.getOperationType();
        if (operationType) {
          this.pslDataForm.disable();
          this.disableSaveBtn = true;
        }
        if (this.loanViewService.checkIsLoan360()) {
          this.pslDataForm.disable();
          this.disableSaveBtn = true;
        }
      })
    });
  }
  onChangelandUnitType(event?: any) {
    let landType = event;
    console.log('landType', landType);
    const landArea = this.pslDataForm.controls.agriculture.controls.landUnitValue.value;
    const landUnit = this.pslDataForm.controls.agriculture.controls.landUnitType.value;
    this.landUnitType.filter((element) => {
      if (element.key === landUnit) {
          const control = this.pslDataForm.controls.agriculture.controls as FormGroup;
          const value = Number(element.factor) * Number(landArea);
          this.landAreaInhectare = value;
          this.landAreaInAcresValue = value;
          this.pslDataForm.controls.agriculture.patchValue({
            landInHectare: value
          });
          this.setValueForPslCategoryByLandArea();
      }
    });

  }

  applyMandatoryToActivity(event: any) {
   if (event === '1PSLACTVTY') {

    } else if ( event === '5PSLACTVTY' || event === '6PSLACTVTY' ) {
     const control = this.pslDataForm.get('nonAgriculture') as FormGroup;
    //  control.clearValidators();
    //  control.updateValueAndValidity();
     control.get('uRecessionNo').setValidators(Validators.required);
     control.get('uRecessionNo').updateValueAndValidity();
     control.get('uRegisteredMobileNo').setValidators(Validators.required);
     control.get('uRegisteredMobileNo').updateValueAndValidity();
     control.get('uRegisteredEmailId').setValidators(Validators.required);
     control.get('uRegisteredEmailId').updateValueAndValidity();
    } else if ( event === '7PSLACTVTY') {
    }
  }
  get f() {
    return this.pslDataForm.controls.nonAgriculture as FormGroup;
  }
  get g() {
    return this.pslDataForm.controls.agriculture as FormGroup;
  }
  convertTocsv() {
    const value = this.formValues.weakerSection;
    if (value) {
      const csValue = value.join();
      console.log('csValue', csValue);
      return csValue;
    }
  }
  csvToArray(event) {
    const value = event;
    if (value) {
      const arrayDump = value.split(',');
      console.log(arrayDump, 'array converted');
      return arrayDump;
     }
  }
  onChangePslSubcategory(event) {
    console.log('event from psl subcategory', event);
    if (event === '4PSLSUBCAT' || event === '5PSLSUBCAT' || event === '6PSLSUBCAT') {
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (event === '4PSLSUBCAT') {
          if (element.key === '4PSLCRTFCTE') {
            this.data = [{ key: element.key, value: element.value }];
            this.pslCertificateValues = this.data;
            this.formValues.pslCCertificate = this.data[0].key;
          }
        } else {
          if (element.key === '5PSLCRTFCTE') {
            this.data = [{ key: element.key, value: element.value }];
            this.pslCertificateValues = this.data;
            this.formValues.pslCCertificate = this.data[0].key;
          }
        }
        });
       }
    this.f.patchValue({
      pslCCertificate : this.data[0].key
     });
    }
  }

