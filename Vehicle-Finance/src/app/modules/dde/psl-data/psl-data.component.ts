import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { LabelsService } from "@services/labels.service";
import { CommomLovService } from "@services/commom-lov-service";
import { PslDataService } from "../services/psl-data.service";
import { ToasterService } from "@services/toaster.service";
import { ToggleDdeService } from '@services/toggle-dde.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Component({
  selector: "app-psl-data",
  templateUrl: "./psl-data.component.html",
  styleUrls: ["./psl-data.component.css"],
})
export class PslDataComponent implements OnInit {
  disableSaveBtn: boolean;
  pslDataForm: FormGroup;
  microSmallAndMediumEnterprises: any;
  agriculture: any;

  // pslId: number;
  leadId;
  productCatCode: string;

  labels: any = {};
  LOV: any = [];
  formValues: any = {};
  pslData: any = [];
  pslDataObj: any = {};
  data: any = [];
  activityLOVS: any = [];
  activityChange: string = "";
  detailActivityChange: string;
  proofOfInvestmentChange: string = "";
  proofOfInvsetmentLOVS: any = [];
  pslDependentLOVSData: any = [];
  detailActivityValues: any = [];
  detailActivityChangeValues: any = [];
  endUseValues: any = [];
  typeOfService: any = [];
  purposeOfLoanChange: any;
  pslCategoryValues: any = [];
  pslSubCategoryValues: any = [];
  pslCategoryChange: string;
  pslCategoryData: any;
  pslSubCategoryData: any;
  pslCertificateValues: any = [];
  weakerSectionValues: any = [];

  landAreaInAcresValue: any;
  pslLandHoldingChange: string;
  plsLandProofChange: any;
  farmerTypeValues: any = [];
  isLandHoldingYes: boolean;
  landProofValues: any = [];
  relationshipWithLandOwner: any = [];
  landOwnerChange: any;
  relationshipWithLandOwnerChange: any;

  // showInputFieldsCA: boolean;
  showInputFieldsInvestments: boolean;
  isInvestmentInEquipment: boolean;
  isInvestmentInPlantMachinery: boolean;
  isGoosManufactured: boolean;
  isDirty: boolean;

  // caRegistrationNumber: string;
  // nameOfCA: string;
  // nameOfCAFirm: string;
  // udinNo: any;
  // loanAmount: any;
  // caCertifiedAmount: any;
  otherInvestmentCost: any;
  totalInvestmentCost: any;
  investmentInEquipmentValue: any;
  investmentInPlantMachineryValue: any;
  pslLandHolding: any = [{ key: 1, value: "Yes" }, { key: 0, value: "No" }];
  businessActivity: any = [{ key: "Not Applicable", value: "Not Applicable" }];

  constructor(
    private formBuilder: FormBuilder,
    private labelsData: LabelsService,
    private createLeadDataService: CreateLeadDataService,
    private commomLovService: CommomLovService,
    private pslDataService: PslDataService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getLeadSectiondata();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data.default),
      // (error) => console.log("PSL_DATA Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
      this.getPslData();
    });
    console.log("LEADID::", this.leadId);
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      this.getDependentDropdownLOV();
      this.getProofOfInvestmentLOVS();
    });
    console.log("PSL-DATA_LOV::", this.LOV);
  }

  //GET LEAD SECTION DATA
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE::", this.productCatCode);
  }

  //Get Dependent API LOV for Activity, Detail Activity & Purpose of Loan
  getDependentDropdownLOV() {
    this.pslDataService.getDependentDropdownLOV().subscribe((res: any) => {
      // console.log("RESPONSE FROM APPIYO_SERVER_PSLDATA_Dependent_LOVS_API_RESPONSE", res);
      const response = res.ProcessVariables.pslDataLovObj;
      // console.log("PSLDATA_Dependent_LOVS_API", response);
      this.pslDependentLOVSData = response;
      this.getLeadId();
      this.getActivityLOVS();
    });
  }

  // CREATE_PSLDATA_FORMGROUPS
  initForm() {
    this.pslDataForm = this.formBuilder.group({
      activity: ["", Validators.required],

      agriculture: this.formBuilder.group({
        activity: [""],
        detailActivity: ["", Validators.required],
        purposeOfLoan: ["", Validators.required],
        landHolding: ["", Validators.required],
        landOwner: [""],
        relationshipWithLandOwner: [""],
        farmerType: ["", Validators.required],
        landArea: [""],
        landProof: [""],
        // landProofUpload: [{ value: "", disabled: true }],
        pslCategory: ["", Validators.required],
        pslSubCategory: ["", Validators.required],
        pslCCertificate: ["", Validators.required],
        weakerSection: ["", Validators.required],
      }),

      microSmallAndMediumEnterprises: this.formBuilder.group({
        activity: [""],
        detailActivity: ["", Validators.required],
        goodsManufactured: [""],
        typeOfService: ["", Validators.required],
        purposeOfLoan: ["", Validators.required],
        businessActivity: [{ value: "", disabled: true }],
        // loanAmount: [""],
        proofOfInvestment: ["", Validators.required],
        // proofOfInvestmentUpload: [{ value: "", disabled: true }],
        // nameOfCA: [""],
        // nameOfCAFirm: [""],
        // caRegistrationNumber: [""],
        // udinNo: [""],
        // caCertifiedAmount: [""],
        otherInvestmentCost: [""],
        totalInvestmentCost: [{ value: this.totalInvestmentCost, disabled: true }],
        investmentInEquipment: [""],
        investmentInPlantAndMachinery: [""],
        pslCategory: ["", Validators.required],
        pslSubCategory: ["", Validators.required],
        pslCCertificate: ["", Validators.required],
        weakerSection: [{ value: "", disabled: true }],
      }),

      housing: this.formBuilder.group({
        activity: [""],
        propertyType: [""],
        detailActivity: [""],
        propertyLocatedCity: [""],
        propertyLocation: [""],
        propertyPincode: [""],
        landAmount: [""],
        landCost: [""],
        constructionCost: [""],
        totalPropertyCost: [""],
        registrationCost: [""],
        pslConsiderationCost: [""],
        pslCategory: [""],
        pslCCertificate: [""],
      }),
      // socialInfrastructure: this.formBuilder.group({
      //   detailActivity: [""],
      //   goodsManufactured: [""],
      //   typeOfService: [""],
      //   purposeOfLoanAg: [""],
      //   purposeOfLoanMsme: [""],
      //   businessActivity: [""],
      //   landHolding: [""],
      //   landOwnerApplicant: [""],
      //   relationshipWithLandOwner: [""],
      //   farmerType: [""],
      //   landArea: [""],
      //   landProof: [""],
      //   landProofUpload: [""],
      //   loanAmount: [""],
      //   proofOfInvestment: [""],
      //   proofOfInvestmentUpload: [""],
      //   nameOfCa: [""],
      //   nameOfCaFirm: [""],
      //   caRegistrationNumber: [""],
      //   udinNo: [""],
      //   caCertifiedAmount: [""],
      //   otherInvestmentCost: [""],
      //   totalInvestmentCost: [""],
      //   investInEquipment: [""],
      //   investmentInPlantMachinery: [""],
      //   pslCategory: [""],
      //   pslCategoryMsme: [""],
      //   pslSubCategory: [""],
      //   pslSubCategoryMsme: [""],
      //   pslCCertificate: [""],
      //   pslCertificateMsme: [""],
      //   weakerSection: [""],
      //   weakerSection: [""],
      // }),
      otherOption: this.formBuilder.group({
        propertyType: [""],
        activity: [""],
        detailActivity: [""],
        goodsManufactured: [""],
        typeOfService: [""],
        purposeOfLoan: [""],
        // purposeOfLoanMsme: [""],
        businessActivity: [""],
        landHolding: [""],
        landOwner: [""],
        relationshipWithLandOwner: [""],
        farmerType: [""],
        landArea: [""],
        landProof: [""],
        // landProofUpload: [""],
        loanAmount: [""],
        proofOfInvestment: [""],
        // proofOfInvestmentUpload: [""],
        nameOfCa: [""],
        nameOfCaFirm: [""],
        caRegistrationNumber: [""],
        udinNo: [""],
        caCertifiedAmount: [""],
        otherInvestmentCost: [""],
        totalInvestmentCost: [""],
        investmentInEquipment: [""],
        investmentInPlantMachinery: [""],
        totalInvestment: [""],
        propertyLocatedCity: [""],
        propertyLocation: [""],
        propertyPincode: [""],
        landAmount: [""],
        landCost: [""],
        constructionCost: [""],
        totalPropertyCost: [""],
        registrationCost: [""],
        pslConsiderationCost: [""],
        pslCategory: [""],
        pslCategoryMsme: [""],
        pslCategoryHos: [""],
        pslSubCategory: [""],
        pslSubCategoryMsme: [""],
        pslCCertificate: [""],
        pslCertificateMsme: [""],
        pslCertificateHos: [""],
        weakerSection: [""],
        // weakerSection: [""],
      }),
    });
  }

  //CALLING_GET_API_FOR_PSL-DATA&&PATCHING_VALUES
  getPslData() {
    const data = this.leadId;
    this.pslDataService.getPslData(data).subscribe((res: any) => {
      // console.log("RESPONSE FROM APPIYO_SERVER_GET_PSL_DATA_API", res);
      const response = res;
      this.pslData = response.ProcessVariables.pslData;
      // console.log("PSLDATA::::", this.pslData);
      if (this.pslData === null) {
        return;
      }
      const activity = this.pslData.activity;
      this.activityChange = activity;
      const dltActivity = this.pslData.detailActivity;
      this.selectFormGroup();
      this.detailActivityChange = dltActivity;
      this.getLovForDetailActivity();
      if (activity === "1PSLACTVTY") {
        this.pslLandHoldingChange = this.pslData.landHolding;
        this.onSelectPslLandHolding();
        this.landOwnerChange = this.pslData.landOwner;
        this.setValueForLandOwner();
        setTimeout(() => {
          this.landAreaInAcresValue = this.pslData.landArea;
          this.setValueForPslCategoryByLandArea();
          this.pslDataForm.patchValue({
            activity: this.pslData.activity,
            agriculture: {
              activity: this.pslData.activity,
              detailActivity: this.pslData.detailActivity,
              purposeOfLoan: this.pslData.purposeOfLoan,
              landHolding: this.pslData.landHolding,
              landOwner: this.pslData.landOwner,
              relationshipWithLandOwner: this.pslData.relationshipWithLandOwner,
              farmerType: this.pslData.farmerType,
              landArea: this.pslData.landArea,
              landProof: this.pslData.landProof,
              // landProofUpload: this.pslData.landProofUpload,
              pslCategory: this.pslData.pslCategory,
              pslSubCategory: this.pslData.pslSubCategory,
              pslCCertificate: this.pslData.pslCCertificate,
              weakerSection: this.pslData.weakerSection,
            },
          });
        });
      } else if (activity === "2PSLACTVTY") {
        // const loanAmount = this.pslData.loanAmount;
        // this.nameOfCA = this.pslData.nameOfCA;
        // this.nameOfCAFirm = this.pslData.nameOfCAFirm;
        // this.udinNo = this.pslData.udinNo;
        setTimeout(() => {
          this.proofOfInvestmentChange = this.pslData.proofOfInvestment;
          this.setValueForProofOfInvetment();
          // this.caRegistrationNumber = this.pslData.caRegistrationNumber;
          // this.caCertifiedAmount = this.pslData.caCertifiedAmount;
          // this.setValueForCaCertifiedAmount();
          this.otherInvestmentCost = this.pslData.otherInvestmentCost;
          this.setValueForOtherInvestmentCost();
          // this.totalInvestmentCost = this.pslData.totalInvestmentCost;
          // this.investmentInEquipmentValue = this.pslData.investmentInEquipment;
          // this.setValueForPslSubCategoryByInvestmentInEquipment();
          // if (this.investmentInEquipmentValue == 0) {
          //   this.investmentInPlantMachineryValue = this.pslData.investmentInPlantAndMachinery;
          //   this.setValueForPslSubCategoryByInvestmentInPlantAndMacinery();
          // }
          this.pslDataForm.patchValue({
            activity: this.pslData.activity,
            microSmallAndMediumEnterprises: {
              activity: this.pslData.activity,
              detailActivity: this.pslData.detailActivity,
              goodsManufactured: this.pslData.goodsManufactured,
              typeOfService: this.pslData.typeOfService,
              purposeOfLoan: this.pslData.purposeOfLoan,
              businessActivity: this.pslData.businessActivity,
              // loanAmount: this.pslData.loanAmount,
              proofOfInvestment: this.pslData.proofOfInvestment,
              // proofOfInvestmentUpload: this.pslData.proofOfInvestmentUpload,
              // nameOfCA: this.pslData.nameOfCA,
              // nameOfCAFirm: this.pslData.nameOfCAFirm,
              // caRegistrationNumber: this.pslData.caRegistrationNumber,
              // udinNo: this.pslData.udinNo,
              // caCertifiedAmount: this.pslData.caCertifiedAmount,
              otherInvestmentCost: this.pslData.otherInvestmentCost,
              totalInvestmentCost: this.pslData.totalInvestmentCost,
              investmentInEquipment: this.pslData.investmentInEquipment,
              investmentInPlantAndMachinery: this.pslData.investmentInPlantAndMachinery,
              pslCategory: this.pslData.pslCategory,
              pslSubCategory: this.pslData.pslSubCategory,
              pslCCertificate: this.pslData.pslCCertificate,
              weakerSection: this.pslData.weakerSection,
            },
          });
        });
      }
      setTimeout(() => {
        const operationType = this.toggleDdeService.getOperationType();
        if (operationType === '1' || operationType === '2') {
          this.pslDataForm.disable();
          this.disableSaveBtn = true;
        }
      })
    });
  }

  //GET LOV of ACTIVITY DROPDOWN
  getActivityLOVS() {
    this.pslDependentLOVSData.map((element) => {
      const data = {
        key: element.activityId,
        value: element.activityName,
      };
      this.activityLOVS.push(data);
      //To filter unique value in Array
      let activityObject = {};
      const activityData = [];
      this.activityLOVS.forEach((element) => {
        if (!activityObject[element.key]) {
          activityObject[element.key] = true;
          activityData.push(element);
        }
      });
      this.activityLOVS = activityData;
      // console.log("ACTIVITYLOVS******", this.activityLOVS);
    });
  }

  //CALL BACK FUNCTION OF onActivityChange()
  selectFormGroup() {
    this.pslDependentLOVSData.map((element) => {
      if (element.activityId === this.activityChange) {
        // console.log("RELATED_DETAILACTIVITY_NAME----", element.dltActivityName);
        const data = {
          key: element.dltActivityId,
          value: element.dltActivityName,
        };
        this.detailActivityValues.push(data);
      }
      // console.log("DETAIL_ACTIVITY_VALUES---", this.detailActivityValues);
    });
    //To filter unique value from Array
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
  }

  //CHANGE IN "DETAIL-ACTIVITY DROPDOWN" BASED ON "ACTIVITY DROPDOWN"
  onActivityChange(event: any) {
    this.detailActivityValues = [];
    this.activityChange = event.target.value;
    console.log("ACTIVITY_CHANGE::::", this.activityChange);
    this.selectFormGroup();
    if (this.detailActivityValues.length === 0) {
      this.detailActivityValues = [
        { key: "Not Applicable", value: "Not Applicable" },
      ];
    }
    //AT_TIME_OF_PAGE_LOADING
    // this.showInputFieldsCA = true;
    this.showInputFieldsInvestments = true;
    this.isInvestmentInEquipment = true;
    this.isInvestmentInPlantMachinery = true;
    this.isLandHoldingYes = true;
    this.isGoosManufactured = true;
    //CLEAR_PREVIOUS_VALUES_OF_FORMCONTROLS_IF_FORMGROUP_CHANGES
    this.pslDataForm.get('agriculture').patchValue({
      detailActivity: "",
      pslCategory: "",
      purposeOfLoan: "",
      landHolding: "",
      landOwner: "",
      // landArea: 0,
      relationshipWithLandOwner: "",
      farmerType: "",
      landProof: "",
      pslSubCategory: "",
      pslCCertificate: "",
      weakerSection: "",
    });
    this.pslDataForm.get('agriculture.landArea').reset();
    this.pslDataForm.get('microSmallAndMediumEnterprises').patchValue({
      detailActivity: "",
      pslCategory: "",
      purposeOfLoan: "",
      goodsManufactured: "",
      typeOfService: "",
      proofOfInvestment: "",
      // otherInvestmentCost: 0,
      // totalInvestmentCost: 0,
      // investmentInEquipment: 0,
      // investmentInPlantAndMachinery: 0,
      pslSubCategory: "",
      pslCCertificate: "",
    });
    this.pslDataForm.get("microSmallAndMediumEnterprises.otherInvestmentCost").reset();
    this.pslDataForm.get("microSmallAndMediumEnterprises.totalInvestmentCost").reset();
    this.pslDataForm.get("microSmallAndMediumEnterprises.investmentInEquipment").reset();
    this.pslDataForm.get("microSmallAndMediumEnterprises.investmentInPlantAndMachinery").reset();
  }

  // GET ALL LOV  FOR "DETAIL-ACIVITY DROPDOWN" WHICH IS BASED ON IT
  getLovForDetailActivity() {
    //CLEAR_PREVIOUS_VALUES_OF_FORMCONTROLS_IF_DETAIL-ACTIVITY_CHANGES
    this.pslDataForm.get("agriculture").patchValue({
      purposeOfLoan: "",
      landHolding: "",
      landOwner: "",
      // landArea: 0,
      relationshipWithLandOwner: "",
      farmerType: "",
      landProof: "",
      pslSubCategory: "",
      pslCCertificate: "",
      weakerSection: "",
    });
    this.pslDataForm.get("agriculture.landArea").reset();
    this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
      purposeOfLoan: "",
      goodsManufactured: "",
      typeOfService: "",
      proofOfInvestment: "",
      pslSubCategory: "",
      pslCCertificate: "",
    });
    //WHEN DETAIL-ACTIVITY CHANGES RESET VALUES
    this.pslDataForm.get("microSmallAndMediumEnterprises.otherInvestmentCost").reset();
    this.pslDataForm.get("microSmallAndMediumEnterprises.totalInvestmentCost").reset();
    //PSL_DEPENDENT_LOV_OPERATION_DETAIL-ACTIVITY
    this.pslDependentLOVSData.map((element) => {
      if (element.dltActivityId === this.detailActivityChange) {
        // console.log("RELATED_ENDUSE_NAME --", element.endUseName);
        const data = {
          key: element.endUseId,
          value: element.endUseName,
        };
        this.endUseValues.push(data);
      }
    });
    //If DETAIL_ACTIVITY AS ALLIED ACTIVITY
    if (this.detailActivityChange === "2PSLDTLACTVTY") {
      this.pslLandHolding = [{ key: 0, value: "No" }];
      // this.landAreaInAcresValue = 0;
      this.pslDataForm.get("agriculture.landArea").reset();
      this.isLandHoldingYes = false; //When selected "Allied Activities" in Detail_Activity
      //IF_DETAILS-ACTIVITY-ALLIED ACTIVITIES--> AUTOMATICALLY PSLSUBCATEGORY AS OTHER-FARMER
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "3PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "3PSLCRTFCTE") {
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
      //AUTOPOPULATE_PSLSUBCATEGORY||PSLCERTIFICATE||WEAKERSECTION DATA_IF_ALLIED-ACTIVITY_SELECTED
      if (this.pslSubCategoryValues.length == 1) {
        this.pslDataForm.get("agriculture").patchValue({
          pslSubCategory: this.pslSubCategoryValues[0].key
        });
      } else {
        this.pslDataForm.get("agriculture").patchValue({
          pslSubCategory: ""
        });
      }
      if (this.pslCertificateValues.length == 1) {
        this.pslDataForm.get("agriculture").patchValue({
          pslCCertificate: this.pslCertificateValues[0].key
        });
      } else {
        this.pslDataForm.get("agriculture").patchValue({
          pslCCertificate: ""
        });
      }
      if (this.weakerSectionValues.length == 1) {
        this.pslDataForm.get("agriculture").patchValue({
          weakerSection: this.weakerSectionValues[0].key
        });
      } else {
        this.pslDataForm.get("agriculture").patchValue({
          weakerSection: ""
        });
      }
    }
    //If DETAIL_ACTIVITY AS AGRICULTURE
    else if (this.detailActivityChange === "1PSLDTLACTVTY") {
      this.pslLandHolding = [
        { key: 1, value: "Yes" },
        { key: 0, value: "No" },
      ];
      this.isLandHoldingYes = true;
    }
    //DETAIL_ACTIVITY_AS_AGRICULTURE_OR_ALLIED-ACTIVITIES
    if (
      this.detailActivityChange === "1PSLDTLACTVTY" ||
      this.detailActivityChange === "2PSLDTLACTVTY"
    ) {
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "1PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
    }
    // IF DETAIL-ACTIVITY AS "MANUFACTURING"
    if (this.detailActivityChange === "5PSLDTLACTVTY") {
      this.isInvestmentInPlantMachinery = true;
      // this.investmentInEquipmentValue = 0;
      this.pslDataForm.get("microSmallAndMediumEnterprises.investmentInEquipment").reset();
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "3PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
      this.typeOfService = [{ key: 'Not Applicable', value: 'Not Applicable' }]
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.goodsManufactured")
        .setValidators([Validators.required]);
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.goodsManufactured")
        .updateValueAndValidity();
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInPlantAndMachinery")
        .setValidators([Validators.required]);
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInPlantAndMachinery")
        .updateValueAndValidity();
    } else {
      this.isInvestmentInPlantMachinery = false;
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.goodsManufactured")
        .clearValidators();
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.goodsManufactured")
        .updateValueAndValidity();
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInPlantAndMachinery")
        .clearValidators();
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInPlantAndMachinery")
        .updateValueAndValidity();
    }
    //IF DETAIL-ACTIVITY AS "SERVICE"
    if (this.detailActivityChange === "6PSLDTLACTVTY") {
      const data = this.LOV.LOVS.typeOfService;
      this.typeOfService = data;
      this.isGoosManufactured = false;
      this.isInvestmentInEquipment = true;
      // this.investmentInPlantMachineryValue = 0;
      this.pslDataForm.get("microSmallAndMediumEnterprises.investmentInPlantAndMachinery").reset();
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "2PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInEquipment")
        .setValidators([Validators.required]);
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInEquipment")
        .updateValueAndValidity();
    } else {
      this.typeOfService = [{ key: "Not Applicable", value: "Not Applicable" }];
      this.isGoosManufactured = true;
      this.isInvestmentInEquipment = false;
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInEquipment")
        .clearValidators();
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.investmentInEquipment")
        .updateValueAndValidity();
    }
    if (this.pslCategoryValues.length == 1) {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslCategory: this.pslCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslCategory: ""
      });
    }
    if (this.pslCategoryValues.length == 1) {
      this.pslDataForm.get("agriculture").patchValue({
        pslCategory: this.pslCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get("agriculture").patchValue({
        pslCategory: ""
      });
    }
  }

  //DETAIL_ACTIVITY DROPDOWN CHANGE
  onChangeDetailActivity(event: any) {
    this.endUseValues = [];
    this.detailActivityChange = event.target.value;
    console.log("DETAILACTIVITY_CHANGE::::", this.detailActivityChange);
    this.getLovForDetailActivity();
  }

  //PURPOSE OF LOAN CHANGE BASED ON DETAIL-ACTIVITY
  onChangePurposeOfLoan(event: any) {
    this.purposeOfLoanChange = event.target.value;
    console.log("purposeOfLoanChange", this.purposeOfLoanChange);
  }

  //LOV CHANGE OF WEAKER SECTION AND SET THE KEY TO AVOID AMIGUITY
  onChangeWeakerSection(event: any) {
    this.formValues.weakerSection = event.target.value;
    console.log("weakerSectionChange::", this.formValues.weakerSection);
  }

  // Change in PSL_SUBCATEGORY BASED UPON INPUT VALUE IN "LAND AREA IN ACRES"
  setValueForPslCategoryByLandArea() {
    this.weakerSectionValues = [];
    if (this.landAreaInAcresValue <= 2.5 && this.landAreaInAcresValue != 0) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "1PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "2PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key === "1PSLWKRSCT") {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
    }
    else if (
      this.landAreaInAcresValue > 2.5 &&
      this.landAreaInAcresValue <= 5
    ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "2PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "1PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      this.LOV.LOVS.weakerSection.filter((element) => {
        if (element.key === "1PSLWKRSCT") {
          const data = { key: element.key, value: element.value };
          this.weakerSectionValues.push(data);
        }
      });
    } else if (this.landAreaInAcresValue > 5) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "3PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "3PSLCRTFCTE") {
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
    //TO AUTO-POPULATE PSL-SUBCATEGORY||PSL-CERTIFICATE||PSL-WEAKERSECTION DATA
    if (this.pslSubCategoryValues.length == 1) {
      this.pslDataForm.get("agriculture").patchValue({
        pslSubCategory: this.pslSubCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get("agriculture").patchValue({
        pslSubCategory: ""
      });
    }
    if (this.pslCertificateValues.length == 1) {
      this.pslDataForm.get("agriculture").patchValue({
        pslCCertificate: this.pslCertificateValues[0].key
      });
    } else {
      this.pslDataForm.get("agriculture").patchValue({
        pslCCertificate: ""
      });
    }
    if (this.weakerSectionValues.length == 1) {
      this.pslDataForm.get("agriculture").patchValue({
        weakerSection: this.weakerSectionValues[0].key
      });
    } else {
      this.pslDataForm.get("agriculture").patchValue({
        weakerSection: ""
      });
    }
  }

  // CHANGE IN LAND AREA VALUE
  onLandAreaChange(event: any) {
    let landAreaChange = event.target.value;
    this.setValueForPslCategoryByLandArea();
  }

  // CHANGE IN VALUE FOR "INVESTMENT IN EQUIPMENT"
  // onChangeInvestmentInEquipment(event: any) {
  //   const investmentInEquipmentChange = event.target.value;
  //   this.investmentInEquipmentValue = this.totalInvestmentCost;
  //   // console.log("this.investmentInEquipmentValue", this.investmentInEquipmentValue);
  //   this.setValueForPslSubCategoryByInvestmentInEquipment();
  // }

  //Change in PSL_SUBCATEGORY BASED UPON INPUT VALUE IN "INVESTMENT IN EQUIPMENT"
  setValueForPslSubCategoryByInvestmentInEquipment() {
    console.log("Investment_In_Equipment_Value::", this.investmentInEquipmentValue);
    if (this.investmentInEquipmentValue <= 1000000 && this.investmentInEquipmentValue != 0) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "4PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "4PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
    }
    else if (
      this.investmentInEquipmentValue > 1000000 &&
      this.investmentInEquipmentValue <= 20000000
    ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "5PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "5PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
    } else if (
      this.investmentInEquipmentValue > 20000000 &&
      this.investmentInEquipmentValue <= 50000000
    ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "6PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "5PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
    }
    //If "Investment in Equipment" is greater than 5 crores then default as Non-PSL
    if (this.investmentInEquipmentValue > 50000000) {
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "4PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        this.pslSubCategoryData = [{ key: 'Not Applicable', value: 'Not Applicable' }];
        this.pslSubCategoryValues = this.pslSubCategoryData;   //If PSL_CATEGORY_AS_Non-PSL---> Not Applicable
        this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        this.data = [{ key: 'Not Applicable', value: 'Not Applicable' }];
        this.pslCertificateValues = this.data;  //If PSL_CATEGORY_AS_Non-PSL---> Not Applicable
        this.formValues.pslCCertificate = this.data[0].key;
      });
    } else {
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "2PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
    }
    //TO AUTO-POPULATE PSL-SUBCATEGORY AND PSL-CERTIFICATE DATA
    if (this.pslSubCategoryValues.length == 1) {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslSubCategory: this.pslSubCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslSubCategory: ""
      });
    }
    if (this.pslCertificateValues.length == 1) {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslCCertificate: this.pslCertificateValues[0].key
      });
    } else {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslCCertificate: ""
      });
    }
  }

  // CHANGE IN VALUE OF INVESTMENT IN PLANT AND MACHINERY
  // onChangeInvestmentInPlantAndMachinery(event: any) {
  //   const investmentInPlantMachineryChange = event.target.value;
  //   this.investmentInPlantMachineryValue = this.totalInvestmentCost;
  //   // console.log("this.investmentInPlantMachineryValue", this.investmentInPlantMachineryValue);
  //   this.setValueForPslSubCategoryByInvestmentInPlantAndMacinery();
  // }

  //Change in PSL_SUBCATEGORY BASED UPON INPUT VALUE IN "INVESTMENT IN PLANT AND MACHINERY"
  setValueForPslSubCategoryByInvestmentInPlantAndMacinery() {
    console.log("Investment_In_Plant_And_Machinery_Value::", this.investmentInPlantMachineryValue);
    if (this.investmentInPlantMachineryValue <= 2500000 && this.investmentInPlantMachineryValue != 0) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "7PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      // console.log("PSLSUBCAT_KEY::", this.pslSubCategoryData[0].key);
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "4PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      // console.log("PSLCERTIFICATE_KEY::", this.data[0].key);
    }
    else if (
      this.investmentInPlantMachineryValue > 2500000 &&
      this.investmentInPlantMachineryValue <= 50000000
    ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "9PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      // console.log("PSLSUBCAT_KEY::", this.pslSubCategoryData[0].key);
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "5PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      // console.log("PSLCERTIFICATE_KEY::", this.data[0].key);
    } else if (
      this.investmentInPlantMachineryValue > 50000000 &&
      this.investmentInPlantMachineryValue <= 100000000
    ) {
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "8PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      // console.log("PSLSUBCAT_KEY::", this.pslSubCategoryData[0].key);
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "5PSLCRTFCTE") {
          this.data = [{ key: element.key, value: element.value }];
          this.pslCertificateValues = this.data;
          this.formValues.pslCCertificate = this.data[0].key;
        }
      });
      // console.log("PSLCERTIFICATE_KEY::", this.data[0].key);
    }
    //If "Investment in Plant and machinery" is greater than 10 crores then default as PSL-CATEGORY Non-PSL
    if (this.investmentInPlantMachineryValue > 100000000) {
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "4PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        this.pslSubCategoryData = [{ key: 'Not Applicable', value: 'Not Applicable' }];
        this.pslSubCategoryValues = this.pslSubCategoryData; //If PSL_CATEGORY_AS_Non-PSL---> Not Applicable
        this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        this.data = [{ key: 'Not Applicable', value: 'Not Applicable' }];
        this.pslCertificateValues = this.data;   //If PSL_CATEGORY_AS_Non-PSL---> Not Applicable
        this.formValues.pslCCertificate = this.data[0].key;
      });
    } else {
      this.LOV.LOVS.pslCategory.filter((element) => {
        if (element.key === "3PSLCAT") {
          this.pslCategoryData = [{ key: element.key, value: element.value }];
          this.pslCategoryValues = this.pslCategoryData;
          this.formValues.pslCategory = this.pslCategoryData[0].key;
        }
      });
    }
    //TO AUTO-POPULATE PSL-SUBCATEGORY AND PSL-CERTIFICATE DATA
    if (this.pslSubCategoryValues.length == 1) {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslSubCategory: this.pslSubCategoryValues[0].key
      });
    } else {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslSubCategory: ""
      });
    }
    if (this.pslCertificateValues.length == 1) {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslCCertificate: this.pslCertificateValues[0].key
      });
    } else {
      this.pslDataForm.get("microSmallAndMediumEnterprises").patchValue({
        pslCCertificate: ""
      });
    }
  }

  //GET LOV FOR "PROOF OF INVESTMENT" EXCEPT "CA CERTIFICATE"
  getProofOfInvestmentLOVS() {
    this.LOV.LOVS.proofOfInvestment.filter((element) => {
      if (element.key != "1PSLINVSTPRF") {
        const data = { key: element.key, value: element.value };
        this.proofOfInvsetmentLOVS.push(data);
      }
    });
  }

  // CHANGE IN LOV OF "PROOF OF INVESTMENT"
  onChangeProofOfInvestment(event: any) {
    this.proofOfInvestmentChange = event.target.value;
    console.log("ProofOfInvestment_ID", this.proofOfInvestmentChange);
    this.setValueForProofOfInvetment();
  }

  // SET VALIDATION BASED ON SELECTED OPTION IN "PROOF OF INVESTMENT"
  setValueForProofOfInvetment() {
    // if (this.proofOfInvestmentChange === "1PSLINVSTPRF") {
    //   this.showInputFieldsCA = true;
    //   this.otherInvestmentCost = 0;
    //   this.totalInvestmentCost = 0;
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCA")
    //     .setValidators([Validators.required]);
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCA")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCAFirm")
    //     .setValidators([Validators.required]);
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCAFirm")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caRegistrationNumber")
    //     .setValidators([Validators.required]);
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caRegistrationNumber")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.udinNo")
    //     .setValidators([Validators.required]);
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.udinNo")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caCertifiedAmount")
    //     .setValidators([Validators.required]);
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caCertifiedAmount")
    //     .updateValueAndValidity();
    // } else {
    //   this.showInputFieldsCA = false;
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCA")
    //     .clearValidators();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCA")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCAFirm")
    //     .clearValidators();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.nameOfCAFirm")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caRegistrationNumber")
    //     .clearValidators();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caRegistrationNumber")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.udinNo")
    //     .clearValidators();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.udinNo")
    //     .updateValueAndValidity();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caCertifiedAmount")
    //     .clearValidators();
    //   this.pslDataForm
    //     .get("microSmallAndMediumEnterprises.caCertifiedAmount")
    //     .updateValueAndValidity();
    // }

    if (
      this.proofOfInvestmentChange === "2PSLINVSTPRF" ||
      this.proofOfInvestmentChange === "3PSLINVSTPRF" ||
      this.proofOfInvestmentChange === "4PSLINVSTPRF"
    ) {
      this.showInputFieldsInvestments = true;
      // this.nameOfCA = "";
      // this.nameOfCAFirm = "";
      // this.caRegistrationNumber = "";
      // this.caCertifiedAmount = 0;
      // this.udinNo = 0;
      // this.totalInvestmentCost = 0;
      // console.log("-------", this.nameOfCAFirm, this.nameOfCAFirm,
      // this.udinNo, this.caCertifiedAmount, this.totalInvestmentCost);

      this.pslDataForm
        .get("microSmallAndMediumEnterprises.otherInvestmentCost")
        .setValidators([Validators.required]);
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.otherInvestmentCost")
        .updateValueAndValidity();
    } else {
      this.showInputFieldsInvestments = false;
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.otherInvestmentCost")
        .clearValidators();
      this.pslDataForm
        .get("microSmallAndMediumEnterprises.otherInvestmentCost")
        .updateValueAndValidity();
    }
  }

  //SET VALIDATION AND SET LOV FOR PSL LAND HOLDING 
  onSelectPslLandHolding() {
    //TO_CLEAR_PREVIOUS_FORMCONTROLS_VALUES_IF_LANDHOLDING_CHANGES
    this.pslDataForm.get("agriculture").patchValue({
      // purposeOfLoan: "",
      landOwner: "",
      relationshipWithLandOwner: "",
      landProof: "",
      farmerType: "",
      // landArea: 0,
      pslSubCategory: "",
      pslCCertificate: "",
      weakerSection: "",
    });
    this.pslDataForm.get("agriculture.landArea").reset();
    this.farmerTypeValues = [];
    this.weakerSectionValues = [];
    if (this.pslLandHoldingChange === "1") {
      this.LOV.LOVS.pslFarmerType.filter((element) => {
        if (element.key === "1PSLFARMER" || element.key === "2PSLFARMER" ||
          element.key === "3PSLFARMER" || element.key === "4PSLFARMER") {
          const data = { key: element.key, value: element.value };
          this.farmerTypeValues.push(data);
          // console.log("FarmerTypeValues_IF_YES*****", this.farmerTypeValues);
        }
      });
      this.isLandHoldingYes = true;
      this.pslDataForm
        .get("agriculture.landArea")
        .setValidators([Validators.required]);
      this.pslDataForm.get("agriculture.landArea").updateValueAndValidity();
      this.pslDataForm
        .get("agriculture.landProof")
        .setValidators([Validators.required]);
      this.pslDataForm.get("agriculture.landProof").updateValueAndValidity();
      this.pslDataForm
        .get("agriculture.landOwner")
        .setValidators([Validators.required]);
      this.pslDataForm.get("agriculture.landOwner").updateValueAndValidity();
      this.pslDataForm
        .get("agriculture.relationshipWithLandOwner")
        .setValidators([Validators.required]);
      this.pslDataForm.get("agriculture.relationshipWithLandOwner").updateValueAndValidity();
    }
    else if (this.pslLandHoldingChange === "0") {
      this.LOV.LOVS.pslFarmerType.filter((element) => {
        if (element.key === "5PSLFARMER" || element.key === "6PSLFARMER") {
          const data = { key: element.key, value: element.value };
          this.farmerTypeValues.push(data);
          // console.log("FarmerTypeValues_IF_NO>>>>", this.farmerTypeValues);
        }
      });
      this.LOV.LOVS.pslSubCategory.filter((element) => {
        if (element.key === "3PSLSUBCAT") {
          this.pslSubCategoryData = [{ key: element.key, value: element.value }];
          this.pslSubCategoryValues = this.pslSubCategoryData;
          this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
        }
      });
      this.LOV.LOVS.pslCertificate.filter((element) => {
        if (element.key === "3PSLCRTFCTE") {
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
      this.pslDataForm.get("agriculture.landArea").reset();
      this.plsLandProofChange = "";
      this.landOwnerChange = "";
      this.relationshipWithLandOwnerChange = "";
      // console.log("VALUES_IF_LANDHOLDING_AS_NO::::",this.landAreaInAcresValue, this.plsLandProofChange, 
      //              this.landOwnerChange, this.relationshipWithLandOwnerChange);
      this.pslDataForm.get("agriculture.landArea").clearValidators();
      this.pslDataForm.get("agriculture.landArea").updateValueAndValidity();
      this.pslDataForm.get("agriculture.landProof").clearValidators();
      this.pslDataForm.get("agriculture.landProof").updateValueAndValidity();
      this.pslDataForm.get("agriculture.landOwner").clearValidators();
      this.pslDataForm.get("agriculture.landOwner").updateValueAndValidity();
      this.pslDataForm.get("agriculture.relationshipWithLandOwner").clearValidators();
      this.pslDataForm.get("agriculture.relationshipWithLandOwner").updateValueAndValidity();
      //TO AUTOPOPULATE DATA_PSLSUBCATEGORY||PSLCERTIFICATE||WEAKERSECTION
      if (this.pslSubCategoryValues.length == 1) {
        this.pslDataForm.get("agriculture").patchValue({
          pslSubCategory: this.pslSubCategoryValues[0].key
        });
      } else {
        this.pslDataForm.get("agriculture").patchValue({
          pslSubCategory: ""
        });
      }
      if (this.pslCertificateValues.length == 1) {
        this.pslDataForm.get("agriculture").patchValue({
          pslCCertificate: this.pslCertificateValues[0].key
        });
      } else {
        this.pslDataForm.get("agriculture").patchValue({
          pslCCertificate: ""
        });
      }
      if (this.weakerSectionValues.length == 1) {
        this.pslDataForm.get("agriculture").patchValue({
          weakerSection: this.weakerSectionValues[0].key
        });
      } else {
        this.pslDataForm.get("agriculture").patchValue({
          weakerSection: ""
        });
      }
    }
  }

  //CHANGE OPTION IN LAND HOLDING
  onChangePslLandHolding(event: any) {
    this.pslLandHoldingChange = event.target.value;
    // console.log("PSL_LANDHOLDING_CHANGE_ID-----", this.pslLandHoldingChange);
    this.onSelectPslLandHolding();
    // console.log("FARMER_TYPE_VALUES---", this.farmerTypeValues);
  }

  //LOV CHANGE IN LAND PROOF
  onChangePslLandProof(event: any) {
    this.plsLandProofChange = event.target.value;
    console.log("this.plsLandProofChange", this.plsLandProofChange);
  }

  // onChangeCaCertifiedAmount(event: any) {
  //   let caCertifiedAmountChange = event.target.value;
  //   this.setValueForCaCertifiedAmount();
  //   console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  // }

  // setValueForCaCertifiedAmount() {
  //   // this.otherInvestmentCost = 0;
  //   if (this.caCertifiedAmount && this.otherInvestmentCost) {
  //     this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
  //     // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  //   } else if (this.caCertifiedAmount) {
  //     this.otherInvestmentCost = 0;
  //     this.totalInvestmentCost =  this.caCertifiedAmount + this.otherInvestmentCost;
  //     // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  //   } else {
  //     this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;

  //   }
  // }

  //VALUE CHANGE IN OTHER INVESTMENT COST
  onChangeOtherInvestmentCost(event: any) {
    let otherInvestmentChange = event.target.value;
    this.setValueForOtherInvestmentCost();
  }

  //SET VALUE FOR OTHER INVESTMENT COST
  setValueForOtherInvestmentCost() {
    if (this.otherInvestmentCost) {
      console.log("OTHER_INVESTMENT_COST::", this.otherInvestmentCost);
      this.totalInvestmentCost = this.otherInvestmentCost;
      console.log("TOTAL_INVESTMENT_COST::", this.totalInvestmentCost);
      if (this.detailActivityChange === "6PSLDTLACTVTY") {
        this.investmentInEquipmentValue = this.totalInvestmentCost;
        this.setValueForPslSubCategoryByInvestmentInEquipment();
        // console.log("INVESTMENT_IN_EQUIPMENT_VALUE::", this.investmentInEquipmentValue);
      }
      if (this.detailActivityChange === "5PSLDTLACTVTY") {
        this.investmentInPlantMachineryValue = this.totalInvestmentCost;
        this.setValueForPslSubCategoryByInvestmentInPlantAndMacinery();
        // console.log("INVESTMENT_IN_PLANT_AND_MACHINERY_VALUE::", this.investmentInPlantMachineryValue);
      }
    }
    // this.caCertifiedAmount = 0;
    // if (this.caCertifiedAmount && this.otherInvestmentCost) {
    //   this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
    //   // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    // } else if (this.otherInvestmentCost) {
    //   this.caCertifiedAmount = 0;
    //   this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
    //   // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    // } else {
    //   this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
    // }
    // // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  }

  //FUNCTION TO CHNAGE LOV IN LAND OWNER
  onChangeLandOwner(event: any) {
    this.landOwnerChange = event.target.value;
    console.log("LandOwner_Change::::", this.landOwnerChange);
    this.setValueForLandOwner();
  }

  //SET LOV FOR LAND OWNER 
  setValueForLandOwner() {
    this.relationshipWithLandOwner = [];
    if (this.landOwnerChange === "APPAPPRELLEAD") {
      this.LOV.LOVS.relationship.filter((element) => {
        if (element.key === "5RELATION") {
          const data = { key: element.key, value: element.value };
          this.relationshipWithLandOwner.push(data);
        }
      });
    } else {
      this.LOV.LOVS.relationship.filter((element) => {
        if (element.key != "5RELATION") {
          const data = { key: element.key, value: element.value };
          this.relationshipWithLandOwner.push(data);
        }
      });
    }
    //AUTOPOPULATE_RELATIONSHIPWITHLANDOWNER_IF_LANDOWNER_AS_APPLICANT
    if (this.relationshipWithLandOwner.length == 1) {
      this.pslDataForm.get('agriculture').patchValue({
        relationshipWithLandOwner: this.relationshipWithLandOwner[0].key
      });
    } else {
      this.pslDataForm.get('agriculture').patchValue({
        relationshipWithLandOwner: ""
      });
    }
  }

  //CHANGE LOV IN RELATIONSGIP WITH LAND OWNER
  onChangeRelationshipLandOwner(event: any) {
    this.relationshipWithLandOwnerChange = event.target.value;
    console.log("relationshipWithLandOwnerChange::::", this.relationshipWithLandOwnerChange);
  }

  // autoSumTotalInvestment(value1, value2) {
  //   if(this.caCertifiedAmount===0 || this.otherInvestmentCost===0) {
  //     this.totalInvestmentCost = 0;
  //     console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  //   } else {
  //     this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
  //   }
  // }

  // onChangeTotalInvestmentCost(event) {
  //   let totalInvestmentChange = event.target.value;
  //   this.totalInvestmentCost = this.otherInvestmentCost;
  //   if (this.caCertifiedAmount) {
  //     this.totalInvestmentCost = this.caCertifiedAmount;
  //   } else 
  //   if (this.otherInvestmentCost) {
  //     this.totalInvestmentCost =  this.otherInvestmentCost;
  //   } else {
  //     this.totalInvestmentCost = 0;
  //   }
  // }

  //SAVE/UPDATE FUNCTION FOR PSL-DATA FORM
  saveOrUpdatePslData() {
    this.agriculture = this.pslDataForm.get("agriculture");
    this.microSmallAndMediumEnterprises = this.pslDataForm.get(
      "microSmallAndMediumEnterprises"
    );
    // FOR AGRICULTURE FORM
    if (this.activityChange === "1PSLACTVTY") {
      this.isDirty = true;
      this.formValues = this.pslDataForm.get("agriculture").value;
      console.log("FormValues::", this.formValues);
      //IF_PSL-CERTIFICATE_NOT_FOUND 
      if (!this.formValues.pslCCertificate) {
        return;
      }
      this.formValues.activity = this.activityChange;
      this.formValues.pslCategory = this.pslCategoryData[0].key;
      this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
      this.formValues.pslCCertificate = this.data[0].key;
      const data = {
        userId: localStorage.getItem("userId"),
        leadId: this.leadId,
        pslData: {
          ...this.formValues,
          // landArea: Number(this.formValues.landArea),
          // landHolding: Number(this.formValues.landHolding)
        },
      };
      if (this.agriculture.valid === true) {
        this.pslDataService.saveOrUpadtePslData(data).subscribe((res: any) => {
          const response = res;
          // this.pslId = response.ProcessVariables.pslId;
          // console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);
          if (response["Error"] == 0 && response['ProcessVariables'].error['code'] == "0") {
            this.toasterService.showSuccess("Record Saved Successfully", "PSL DATA");
          } else {
            this.toasterService.showError(response['ProcessVariables'].error['message'], "PSL DATA");
          }
        });
      } else {
        this.toasterService.showError("Please fill all mandatory fields.", "PSL DATA");
      }
    }
    //FOR "Micro Small And Medium Enterprises" FORM
    else if (this.activityChange === "2PSLACTVTY") {
      this.isDirty = true;
      this.formValues = this.pslDataForm.get("microSmallAndMediumEnterprises").value;
      console.log("FormValues::", this.formValues);
      //IF_PSL-CERTIFICATE_NOT_FOUND 
      if (!this.formValues.pslCCertificate) {
        return;
      }
      this.formValues.activity = this.activityChange;
      this.formValues.pslCCertificate = this.data[0].key;
      this.formValues.pslCategory = this.pslCategoryData[0].key;
      this.formValues.pslSubCategory = this.pslSubCategoryData[0].key;
      this.formValues.typeOfService = this.typeOfService[0].key;
      this.formValues.purposeOfLoan = this.purposeOfLoanChange;
      this.formValues.totalInvestmentCost = this.totalInvestmentCost;
      const data = {
        userId: localStorage.getItem("userId"),
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
      if (this.microSmallAndMediumEnterprises.valid === true) {
        this.pslDataService.saveOrUpadtePslData(data).subscribe((res: any) => {
          const response = res;
          // console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);
          if (response["Error"] == 0 && response['ProcessVariables'].error['code'] == "0") {
            this.toasterService.showSuccess("Record Saved Successfully", "PSL DATA");
          } else {
            this.toasterService.showError(response['ProcessVariables'].error['message'], "PSL DATA");
          }
        });
      } else {
        this.toasterService.showError("Please fill all mandatory fields.", "PSL DATA");
      }
    }
  }

  //FORM_SUBMIT_FUNCTION
  onFormSubmit() {
    this.saveOrUpdatePslData();
  }

  //NAVIGATE_NEXT_BASED_ON_PRODUCT_CODE
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
}
