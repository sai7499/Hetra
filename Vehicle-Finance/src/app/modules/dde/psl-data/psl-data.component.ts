import { Component, OnInit, OnChanges} from "@angular/core";
import { FormGroup, FormBuilder, NgControl, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { LabelsService } from "@services/labels.service";
import { CommomLovService } from "@services/commom-lov-service";
import { DdeStoreService } from "@services/dde-store.service";
import { PslDataService } from "../services/psl-data.service";
import { Location } from '@angular/common';
import { ToasterService} from '@services/toaster.service';

@Component({
  selector: "app-psl-data",
  templateUrl: "./psl-data.component.html",
  styleUrls: ["./psl-data.component.css"],
})
export class PslDataComponent implements OnInit, OnChanges {
  pslDataForm: FormGroup;

  microSmallAndMediumEnterprises: any;
  agriculture: any;

  // pslId: number;
  leadId;

  labels: any = {};
  LOV: any = [];
  test: any;
  
  formValues: any = {};
  pslData: any = [];
  pslDataObj: any= {};
  data: any = [];

  activityChange: string = "";
  detailActivityChange: string;
  proofOfInvestmentChange: string = "";

  pslDependentLOVSData: any = [];
  detailActivityValues: any = [];
  detailActivityChangeValues: any = [];
  endUseValues: any = [];
  typeOfService: any = [];

  pslCategoryValues: any = [];
  pslSubCategoryValues: any = [];
  pslCategoryChange: string;

  pslSubCategoryChange: string;
  pslCertificateValues: any = [];
  weakerSectionValues: any = [];

  landAreaInAcresValueMap: number;
  landAreaInAcresValue: number;
  pslSubCategoryValueMap: any = [];

  pslLandHoldingChange: string;
  farmerTypeValues: any = [];
  isLandHoldingYes: boolean;
  landProofValues: any = [];

  showInputFieldsCA: boolean;
  showInputFieldsInvestments: boolean;
  isInvestmentInEquipment: boolean;
  isInvestmentInPlantMachinery: boolean;
  isGoosManufactured: boolean;
  
  investmentInEquipmentValue: number = 0;
  investmentInEquipmentValueMap: any = [];
  investmentInPlantMachineryValue: number = 0;
  investmentInPlantMachineryMap: any = [];
  
  caRegistrationNumber: string = '';
  caCertifiedAmount: number = 0;
  otherInvestmentCost: number = 0;
  totalInvestmentCost: number = 0;

  isDirty : boolean;

  pslLandHolding: any = [{ key: 1, value: "Yes" },{ key: 0, value: "No" }];
  businessActivity: any = [{ key: "Not Applicable", value: "Not Applicable" }];

  regexPattern = {
    namePattern: {
      rule: "^[A-Za-z0-9 ]+$",
      msg: 'Invalid Name /  Special Characters not allowed'
    },
    nameLength: {
      rule: 40,
      msg: ''
    },
    numberLength: {
      rule: 10,
      msg: ''
    },
    numberPattern: {
      rule: "^[1-9][0-9]*$",
      msg: 'Invalid Input / Alphabets and Special Characters not allowed'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private pslDataService: PslDataService,
    private ddeStoreService: DdeStoreService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private toasterService : ToasterService,
    private location: Location
  ) {}

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    this.getLabels();
    this.getLOV();
    this.initForm();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
      (error) => console.log("PSL_DATA Label Error", error)
    );
  }

  getLeadId() {
    this.aRoute.parent.params.subscribe((val) =>{
      this.leadId = Number(val.leadId);
      this.getPslData();
    });
    console.log("LEADID--->", this.leadId);
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {(this.LOV = lov); 
      this.getDependentDropdownLOV();
    });
    console.log("PSL DATA LOV  --->", this.LOV);
  }

  initForm() {
    this.pslDataForm = this.formBuilder.group({
      activity: ["", Validators.required],

      agriculture: this.formBuilder.group({
        activity: [this.LOV.LOVS.pslActivity[1].key],
        detailActivity: ["", Validators.required],
        purposeOfLoan: ["", Validators.required],
        landHolding: ["", Validators.required],
        landOwner: ["", Validators.required],
        relationshipWithLandOwner: ["", Validators.required],
        farmerType: ["", Validators.required],
        landArea: [""],
        landProof: [""],
        landProofUpload: [{value: '', disabled: true}],
        pslCategory: ["", Validators.required],
        pslSubCategory: ["", Validators.required],
        pslCCertificate: ["", Validators.required],
        weakerSection: ["", Validators.required],
      }),

      microSmallAndMediumEnterprises: this.formBuilder.group({
        activity: [this.LOV.LOVS.pslActivity[0].key],
        detailActivity: ["", Validators.required],
        goodsManufactured: ["", Validators.required],
        typeOfService: ["", Validators.required],
        purposeOfLoan: ["", Validators.required],
        businessActivity: [{value: '', disabled: true}],
        loanAmount: ["", Validators.required],
        proofOfInvestment: ["", Validators.required],
        proofOfInvestmentUpload: [{value: '', disabled: true}],
        nameOfCA: [""],
        nameOfCAFirm: [""],
        caRegistrationNumber: [""],
        udinNo: [""],
        caCertifiedAmount: [""],
        otherInvestmentCost: ["", Validators.required],
        totalInvestmentCost: ["", Validators.required],
        investmentInEquipment: [""],
        investmentInPlantAndMachinery: [""],
        pslCategory: ["", Validators.required],
        pslSubCategory: ["", Validators.required],
        pslCCertificate: ["", Validators.required],
        weakerSection: [{value: '', disabled: true}],
      }),

      housing: this.formBuilder.group({
        activity: [this.LOV.LOVS.pslActivity[2].key],
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
        landProofUpload: [""],
        loanAmount: [""],
        proofOfInvestment: [""],
        proofOfInvestmentUpload: [""],
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

  // getActivityControl() {
  //   return {
  //     activity: this.LOV.LOVS.pslActivity[0].key
  //   }
  // }

  getDependentDropdownLOV() {
    this.pslDataService.getDependentDropdownLOV().subscribe((res: any) => {
      console.log("RESPONSE FROM APPIYO_SERVER_PSLDATA_Dependent_LOVS_API_RESPONSE", res);
      const response = res.ProcessVariables.pslDataLovObj;
      console.log("PSLDATA_Dependent_LOVS_API", response);
      this.pslDependentLOVSData = response;
      this.getLeadId(); 
    });
  }


 getPslData() {
    const data = this.leadId;
    this.pslDataService.getPslData(data).subscribe((res:any) => {
      console.log("RESPONSE FROM APPIYO_SERVER_GET_PSL_DATA_API", res);
      const response = res;
      this.pslData = response.ProcessVariables.pslData;      
      // console.log("PSLDATA", this.pslData);
      if(this.pslData===null) {
        return;
      }
      // this.onSelectPslLandHolding();
      const activity = this.pslData.activity;
      this.activityChange = activity;
      const dltActivity = this.pslData.detailActivity;
      this.selectFormGroup();
      this.detailActivityChange = dltActivity;   
      this.getLovForDetailActivity();

      if(activity==='1PSLACTVTY') {
        this.pslLandHoldingChange = this.pslData.landHolding;
        this.onSelectPslLandHolding();
        this.pslSubCategoryChange =  this.pslData.pslSubCategory;
        this.setValueForPslSubCategory();
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
              landProofUpload: this.pslData.landProofUpload,
              pslCategory: this.pslData.pslCategory,
              pslSubCategory: this.pslData.pslSubCategory,
              pslCCertificate: this.pslData.pslCCertificate,
              weakerSection: this.pslData.weakerSection
            }
        });        
        });
    }

    else if(activity ==='2PSLACTVTY') {
      const loanAmount = this.pslData.loanAmount;
      this.pslSubCategoryChange =  this.pslData.pslSubCategory;
      this.setValueForPslSubCategory();
      setTimeout(() => {
        this.proofOfInvestmentChange = this.pslData.proofOfInvestment;
        this.setValueForProofOfInvetment();
        this.caRegistrationNumber = this.pslData.caRegistrationNumber;
        this.caCertifiedAmount = this.pslData.caCertifiedAmount;
        this.setValueForCaCertifiedAmount();
        this.otherInvestmentCost = this.pslData.otherInvestmentCost;
        this.setValueForOtherInvestmentCost();  
        this.investmentInEquipmentValue = this.pslData.investmentInEquipment;
        this.setValueForPslSubCategoryByInvestmentInEquipment();
        if(!this.investmentInEquipmentValue) {
          this.investmentInPlantMachineryValue = this.pslData.investmentInPlantAndMachinery;
          this.setValueForPslSubCategoryByInvestmentInPlantAndMacinery();
        }

        this.pslDataForm.patchValue({
          activity: this.pslData.activity,
          microSmallAndMediumEnterprises :{
          activity: this.pslData.activity,
          detailActivity: this.pslData.detailActivity,
          goodsManufactured: this.pslData.goodsManufactured,
          typeOfService: this.pslData.typeOfService,
          purposeOfLoan: this.pslData.purposeOfLoan,
          businessActivity: this.pslData.businessActivity,
          loanAmount: this.pslData.loanAmount,
          proofOfInvestment: this.pslData.proofOfInvestment,
          proofOfInvestmentUpload: this.pslData.proofOfInvestmentUpload,
          nameOfCA: this.pslData.nameOfCA,
          nameOfCAFirm: this.pslData.nameOfCAFirm,
          caRegistrationNumber: this.pslData.caRegistrationNumber,
          udinNo: this.pslData.udinNo,
          caCertifiedAmount: this.pslData.caCertifiedAmount,
          otherInvestmentCost: this.pslData.otherInvestmentCost,
          totalInvestmentCost: this.pslData.totalInvestmentCost,
          investmentInEquipment: this.pslData.investmentInEquipment,
          investmentInPlantAndMachinery: this.pslData.investmentInPlantAndMachinery,
          pslCategory: this.pslData.pslCategory,
          pslSubCategory: this.pslData.pslSubCategory,
          pslCCertificate: this.pslData.pslCCertificate,
          weakerSection: this.pslData.weakerSection,
          }
          
        });
      });
      
    }
  });
 }

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
    //To filter unique value in Array
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
  onActivityChange(event: any) {
    this.detailActivityValues = [];
    this.activityChange = event.target.value;
    // if(!this.activityChange){
    //   return;
    // }
    // console.log("ACTIVITY_CHANGE----", this.activityChange);
    this.selectFormGroup();
    if (this.detailActivityValues.length === 0) {
      this.detailActivityValues = [{ key: "Not Applicable", value: "Not Applicable" }];
    }
    //SHOW ALL OPTIONS_MSME
    this.showInputFieldsCA = true;
    this.showInputFieldsInvestments = true;

    this.isInvestmentInEquipment = true;
    this.isInvestmentInPlantMachinery = true;

    this.isLandHoldingYes = true;
    this.isGoosManufactured = true;
  }

  getLovForDetailActivity() {
    this.pslDataForm.get('agriculture').patchValue({
      landHolding: ''
    });
    this.pslDependentLOVSData.map((element) => {
      if (element.dltActivityId === this.detailActivityChange) {
        // console.log("RELATED_ENDUSE_NAME --", element.endUseName);
        const data = {
          key: element.endUseId,
          value: element.endUseName,
        };
        this.endUseValues.push(data);
      }
      //If selected as MSME service
      if (this.detailActivityChange === "6PSLDTLACTVTY") {
        const data = this.LOV.LOVS.typeOfService;
        this.typeOfService = data;
        this.isGoosManufactured = false;
      } else {
        this.typeOfService = [{ key: 'Not Applicable', value: 'Not Applicable'}];
        this.isGoosManufactured = true;
      }
    });

    if (this.detailActivityChange === "2PSLDTLACTVTY") {
      this.pslLandHolding = [{ key: 0, value: "No" }];
      // this.isLandHoldingYes = false;   //When selected "Allied Activities" in Detail_Activity
      const data = [
        {
          key: this.LOV.LOVS.pslSubCategory[2].key,
          value: this.LOV.LOVS.pslSubCategory[2].value,
        },
      ];
      this.pslSubCategoryValues = data;
    } else if (this.detailActivityChange === "1PSLDTLACTVTY") {
      this.pslLandHolding = [
        { key: 1, value: "Yes" },
        { key: 0, value: "No" },
      ];
      // const data = [
      //   {
      //     key: this.LOV.LOVS.pslSubCategory[0].key,
      //     value: this.LOV.LOVS.pslSubCategory[0].value,
      //   },
      //   {
      //     key: this.LOV.LOVS.pslSubCategory[1].key,
      //     value: this.LOV.LOVS.pslSubCategory[1].value,
      //   },
      //   {
      //     key: this.LOV.LOVS.pslSubCategory[2].key,
      //     value: this.LOV.LOVS.pslSubCategory[2].value,
      //   },
      // ];
      // this.pslSubCategoryValues = data;
    }

    //For DETAIL_ACTIVITY--AGRICULTURE OR ALLIED>>>>>
    if (
      this.detailActivityChange === "1PSLDTLACTVTY" ||
      this.detailActivityChange === "2PSLDTLACTVTY"
    ) {
      const data = [
        {
          key: this.LOV.LOVS.pslCategory[0].key,
          value: this.LOV.LOVS.pslCategory[0].value,
        },
      ];
      this.pslCategoryValues = data;
    }

    //For ACTIVITY--MSME>>>>> Detail Activity SERVICE AND MANUFACTURING
    if (this.detailActivityChange === "5PSLDTLACTVTY") {
      this.isInvestmentInPlantMachinery = true;
      const data = [
        {
          key: this.LOV.LOVS.pslCategory[2].key,
          value: this.LOV.LOVS.pslCategory[2].value,
        },
      ];
      this.pslCategoryValues = data;
    } else {
      this.isInvestmentInPlantMachinery = false;
    }

    if (this.detailActivityChange === "6PSLDTLACTVTY") {
      this.isInvestmentInEquipment = true;
      const data = [
        {
          key: this.LOV.LOVS.pslCategory[1].key,
          value: this.LOV.LOVS.pslCategory[1].value,
        },
      ];
      this.pslCategoryValues = data;
    } else {
      this.isInvestmentInEquipment = false;
    }

  }

  onChangeDetailActivity(event: any) {
    this.endUseValues = [];
    this.detailActivityChange = event.target.value;
    // console.log("DETAILACTIVITY_CHANGE ----", this.detailActivityChange);
    this.getLovForDetailActivity();
  }

  // onChangePslCategory(event: any) {
  //   this.pslCategoryChange = event.target.value;
  //   console.log("PSL_CATEGORY_ID", this.pslCategoryChange);
  //   if (this.pslCategoryChange === "1PSLCAT") {
  //     const data = [
  //       {
  //         key: this.LOV.LOVS.pslSubCategory[0].key,
  //         value: this.LOV.LOVS.pslSubCategory[0].value,
  //       },
  //       {
  //         key: this.LOV.LOVS.pslSubCategory[1].key,
  //         value: this.LOV.LOVS.pslSubCategory[1].value,
  //       },
  //       {
  //         key: this.LOV.LOVS.pslSubCategory[2].key,
  //         value: this.LOV.LOVS.pslSubCategory[2].value,
  //       },
  //     ];
  //     this.pslSubCategoryValues = data;
  //   }
  // }

  setValueForPslSubCategory() {
    if (this.pslSubCategoryChange === "2PSLSUBCAT") {
      this.data = [
        {
          key: this.LOV.LOVS.pslCertificate[0].key,
          value: this.LOV.LOVS.pslCertificate[0].value,
        },
      ];
      this.pslCertificateValues = this.data;
      // console.log('pslCertificateValues', this.pslCertificateValues);
      this.formValues.pslCCertificate = this.data[0].key;

    } else if (this.pslSubCategoryChange === "1PSLSUBCAT") {
      this.data = [
        {
          key: this.LOV.LOVS.pslCertificate[1].key,
          value: this.LOV.LOVS.pslCertificate[1].value,
        },
      ];
      this.pslCertificateValues = this.data;
      // console.log('pslCertificateValues', this.pslCertificateValues);
      this.formValues.pslCCertificate = this.data[0].key;

    } else if (this.pslSubCategoryChange === "3PSLSUBCAT") {
      this.data = [
        {
          key: this.LOV.LOVS.pslCertificate[2].key,
          value: this.LOV.LOVS.pslCertificate[2].value,
        },
      ];
      this.pslCertificateValues = this.data;
      // console.log('pslCertificateValues', this.pslCertificateValues);
      this.formValues.pslCCertificate = this.data[0].key;
    }
    //FOR PSL_SUBCATEGORY AS MICRO
    else if (
      this.pslSubCategoryChange === "7PSLSUBCAT" ||
      this.pslSubCategoryChange === "4PSLSUBCAT"
    ) {
      this.data = [
        {
          key: this.LOV.LOVS.pslCertificate[3].key,
          value: this.LOV.LOVS.pslCertificate[3].value,
        },
      ];
      this.pslCertificateValues = this.data;
      // console.log('pslCertificateValues', this.pslCertificateValues);
      this.formValues.pslCCertificate = this.data[0].key;
      
    } else if(this.pslSubCategoryChange === "5PSLSUBCAT" || this.pslSubCategoryChange === "6PSLSUBCAT" ||
              this.pslSubCategoryChange === "8PSLSUBCAT" || this.pslSubCategoryChange === "9PSLSUBCAT") {
      this.data = [
        {
          key: this.LOV.LOVS.pslCertificate[4].key,
          value: this.LOV.LOVS.pslCertificate[4].value,
        },
      ];
      this.pslCertificateValues = this.data;
      // console.log('pslCertificateValues', this.pslCertificateValues);
      this.formValues.pslCCertificate = this.data[0].key;
    }

    //FOR AGRICULTURE
    if (
      this.pslSubCategoryChange === "1PSLSUBCAT" ||
      this.pslSubCategoryChange === "2PSLSUBCAT"
    ) {
      const data = [
        {
          key: this.LOV.LOVS.weakerSection[0].key,
          value: this.LOV.LOVS.weakerSection[0].value,
        },
      ];
      this.weakerSectionValues = data;
    } else if (this.pslSubCategoryChange === "3PSLSUBCAT") {
      const data = [
        {
          key: this.LOV.LOVS.weakerSection[1].key,
          value: this.LOV.LOVS.weakerSection[1].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[2].key,
          value: this.LOV.LOVS.weakerSection[2].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[3].key,
          value: this.LOV.LOVS.weakerSection[3].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[4].key,
          value: this.LOV.LOVS.weakerSection[4].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[5].key,
          value: this.LOV.LOVS.weakerSection[5].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[6].key,
          value: this.LOV.LOVS.weakerSection[6].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[7].key,
          value: this.LOV.LOVS.weakerSection[7].value,
        },
        {
          key: this.LOV.LOVS.weakerSection[8].key,
          value: this.LOV.LOVS.weakerSection[8].value,
        },
      ];
      this.weakerSectionValues = data;      
    } else {
      this.weakerSectionValues = [{ key: "Not Applicable", value: "Not Applicable" }];
    }
    this.pslDataForm.get('agriculture').patchValue({
      weakerSection: ''
    });
  }
 
  onChangePslSubCategory(event: any) {
    this.pslSubCategoryChange = event.target.value;
    // console.log("PSL_SUBCATEGORY_ID", this.pslSubCategoryChange);
    this.setValueForPslSubCategory();
  }

  onChangeWeakerSection(event: any) {
    this.formValues.weakerSection = event.target.value;
    // console.log("this.formValues.weakerSection  ", this.formValues.weakerSection);
  }


  // onChangePslCertificate (event:any) {
  //   let pslCerticateChange = event.target.value;
  //   console.log("PSL_CERTIFICATE_CHANGE_ID--", pslCerticateChange);
    // if (this.pslSubCategoryChange === "1PSLSUBCAT" || this.pslSubCategoryChange === "2PSLSUBCAT") {
    //   const data = [
    //     {
    //       key: this.LOV.LOVS.weakerSection[0].key,
    //       value: this.LOV.LOVS.weakerSection[0].value,
    //     }
    //   ];
    //   this.weakerSectionValues = data;
    // }
  // }

  setValueForPslCategoryByLandArea() {
    this.pslSubCategoryValueMap = this.LOV.LOVS.pslSubCategory;
    this.landAreaInAcresValueMap = this.pslSubCategoryValueMap.filter(
      (element) => {
       if (this.landAreaInAcresValue <= 2.5 ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[0].key,
              value: this.LOV.LOVS.pslSubCategory[0].value,
            },
          ];
          this.pslSubCategoryValues = data;
        }
        // console.log("ELEMENT--------------------", element);
        else if (
          this.landAreaInAcresValue > 2.5 &&
          this.landAreaInAcresValue <= 5
        ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[1].key,
              value: this.LOV.LOVS.pslSubCategory[1].value,
            },
          ];
          this.pslSubCategoryValues = data;
        } else {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[2].key,
              value: this.LOV.LOVS.pslSubCategory[2].value,
            },
          ];
          this.pslSubCategoryValues = data;
        }
      }
    );
    this.pslDataForm.get('agriculture').patchValue({
      pslSubCategory: ''
    })
  }

  // Chnage in PSL_SUBCATEGORY BASED UPON INPUT VALUE IN LANDAREAINACRES
  onLandAreaChange(event: any) {
    let landAreaChange = event.target.value;
    this.setValueForPslCategoryByLandArea();
  }

  onChangeInvestmentInEquipment(event: any) {
    let investmentInEquipmentChange = event.target.value;
      this.investmentInEquipmentValue = this.totalInvestmentCost;
      // console.log("this.investmentInEquipmentValue", this.investmentInEquipmentValue);
      this.setValueForPslSubCategoryByInvestmentInEquipment();
  }

  setValueForPslSubCategoryByInvestmentInEquipment() {
    this.pslSubCategoryValueMap = this.LOV.LOVS.pslSubCategory;
    this.investmentInEquipmentValueMap = this.pslSubCategoryValueMap.filter(
      (element) => {
        if (this.investmentInEquipmentValue <= 1000000) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[3].key,
              value: this.LOV.LOVS.pslSubCategory[3].value,
            },
          ];
          this.pslSubCategoryValues = data;
        }
        // console.log("ELEMENT--------------------", element);
        else if (
          this.investmentInEquipmentValue > 1000000 &&
          this.investmentInEquipmentValue <= 20000000
        ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[4].key,
              value: this.LOV.LOVS.pslSubCategory[4].value,
            },
          ];
          this.pslSubCategoryValues = data;
        } else if (
          this.investmentInEquipmentValue > 20000000 &&
          this.investmentInEquipmentValue <= 50000000
        ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[5].key,
              value: this.LOV.LOVS.pslSubCategory[5].value,
            },
          ];
          this.pslSubCategoryValues = data;
        }
      }
    );
    this.pslDataForm.get('microSmallAndMediumEnterprises').patchValue({
      pslSubCategory: ''
    });
  }

  onChangeInvestmentInPlantAndMachinery(event: any) {
    let investmentInPlantMachineryChange = event.target.value;
    this.investmentInPlantMachineryValue = this.totalInvestmentCost;
    // console.log("this.investmentInPlantMachineryValue", this.investmentInPlantMachineryValue);
    this.setValueForPslSubCategoryByInvestmentInPlantAndMacinery()
  }

  setValueForPslSubCategoryByInvestmentInPlantAndMacinery() {
    this.pslSubCategoryValueMap = this.LOV.LOVS.pslSubCategory;
   
    this.investmentInPlantMachineryMap = this.pslSubCategoryValueMap.filter(
      (element) => {
        if (this.investmentInPlantMachineryValue <= 2500000) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[6].key,
              value: this.LOV.LOVS.pslSubCategory[6].value,
            },
          ];
          this.pslSubCategoryValues = data;
        }
        // console.log("ELEMENT--------------------", element);
        else if (
          this.investmentInPlantMachineryValue > 2500000 &&
          this.investmentInPlantMachineryValue <= 50000000
        ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[8].key,
              value: this.LOV.LOVS.pslSubCategory[8].value,
            },
          ];
          this.pslSubCategoryValues = data;
        } else if (
          this.investmentInPlantMachineryValue > 50000000 &&
          this.investmentInPlantMachineryValue <= 100000000
        ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[7].key,
              value: this.LOV.LOVS.pslSubCategory[7].value,
            },
          ];
          this.pslSubCategoryValues = data;
        }
      }
    );
    this.pslDataForm.get('microSmallAndMediumEnterprises').patchValue({
      pslSubCategory: ''
    });
  }

  onChangeProofOfInvestment(event: any) {
    this.proofOfInvestmentChange = event.target.value;
    console.log("ProofOfInvestment_ID", this.proofOfInvestmentChange);
    this.setValueForProofOfInvetment();
  }

  setValueForProofOfInvetment() {
    if (this.proofOfInvestmentChange === "1PSLINVSTPRF") {
      this.showInputFieldsCA = true;
    } 
    else {
      this.showInputFieldsCA = false;
    }

    if (
      this.proofOfInvestmentChange === "2PSLINVSTPRF" ||
      this.proofOfInvestmentChange === "3PSLINVSTPRF" ||
      this.proofOfInvestmentChange === "4PSLINVSTPRF"
    ) {
      this.showInputFieldsInvestments = true;
      this.investmentInPlantMachineryValue = 0;
    } else {
      this.showInputFieldsInvestments = false;
    }
  }

  onSelectPslLandHolding() {
    if (this.pslLandHoldingChange === "1") {
      const data = [
        {
          key: this.LOV.LOVS.pslFarmerType[0].key,
          value: this.LOV.LOVS.pslFarmerType[0].value,
        },
        {
          key: this.LOV.LOVS.pslFarmerType[1].key,
          value: this.LOV.LOVS.pslFarmerType[1].value,
        },
        {
          key: this.LOV.LOVS.pslFarmerType[2].key,
          value: this.LOV.LOVS.pslFarmerType[2].value,
        },
        {
          key: this.LOV.LOVS.pslFarmerType[3].key,
          value: this.LOV.LOVS.pslFarmerType[3].value,
        },
      ];
      this.farmerTypeValues = data;
      this.isLandHoldingYes = true;
    } else if (this.pslLandHoldingChange === "0") {
      const data = [
        {
          key: this.LOV.LOVS.pslFarmerType[4].key,
          value: this.LOV.LOVS.pslFarmerType[4].value,
        },
        {
          key: this.LOV.LOVS.pslFarmerType[5].key,
          value: this.LOV.LOVS.pslFarmerType[5].value,
        },
      ];
      this.farmerTypeValues = data;
      this.isLandHoldingYes = false;
    } 
    else if( this.detailActivityChange==='1PSLDTLACTVTY' && this.pslLandHoldingChange === "0" ) {
   //IF DETAIL_ACTIVITY AS AGRICULTURE AND PSL_LANDHOLDING AS "NO"
   this.landAreaInAcresValue = 0;
   const pslSubCategoryData = [
     {
       key: this.LOV.LOVS.pslSubCategory[0].key,
       value: this.LOV.LOVS.pslSubCategory[0].value,
     }
   ];
   this.pslSubCategoryValues = pslSubCategoryData;
    }
  }

  onChangePslLandHolding(event: any) {
    this.pslLandHoldingChange = event.target.value;
    console.log("PSL_LANDHOLDING_CHANGE_ID-----", this.pslLandHoldingChange);
    this.onSelectPslLandHolding();
    // console.log("FARMER_TYPE_VALUES---", this.farmerTypeValues);    
  }

  onChangeCaCertifiedAmount(event:any) {
    let caCertifiedAmountChange = event.target.value;
    this.setValueForCaCertifiedAmount();
    console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  }

  setValueForCaCertifiedAmount() {
    // this.otherInvestmentCost = 0;
    if(this.caCertifiedAmount && this.otherInvestmentCost) {
      this.totalInvestmentCost = +this.caCertifiedAmount + +this.otherInvestmentCost;
      // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    }
    else  if( this.caCertifiedAmount) {
      this.otherInvestmentCost = 0;
      this.totalInvestmentCost = +this.caCertifiedAmount + +this.otherInvestmentCost;
      // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    }
    else {
      this.totalInvestmentCost = +this.caCertifiedAmount + +this.otherInvestmentCost;
    }
  }

  onChangeOtherInvestmentCost(event:any) {
    let otherInvestmentChange = event.target.value;
    this.setValueForOtherInvestmentCost();
  }

  setValueForOtherInvestmentCost() {
      // this.caCertifiedAmount = 0;
    if(this.caCertifiedAmount && this.otherInvestmentCost) {
      this.totalInvestmentCost = +this.caCertifiedAmount + +this.otherInvestmentCost;
      // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    }
    else if(this.otherInvestmentCost) {
      this.caCertifiedAmount = 0;
      this.totalInvestmentCost = +this.caCertifiedAmount + +this.otherInvestmentCost;
      // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    }
  else {
    this.totalInvestmentCost = +this.caCertifiedAmount + +this.otherInvestmentCost;
  }
  // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  }

  // autoSumTotalInvestment(value1, value2) {
  //   if(this.caCertifiedAmount===0 || this.otherInvestmentCost===0) {
  //     this.totalInvestmentCost = 0;
  //     console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  //   } else {
  //     this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
  //   }
  // }
  onChangeTotalInvestmentCost(event) {
    let totalInvestmentChange = event.target.value;
    if(this.caCertifiedAmount) {
      this.totalInvestmentCost = +this.caCertifiedAmount;
    } 
    else if(this.otherInvestmentCost) {
      this.totalInvestmentCost = +this.otherInvestmentCost;
    } else {
      this.totalInvestmentCost = 0;
    }
  }

  saveOrUpdatePslData() {
    this.agriculture = this.pslDataForm.get('agriculture');
    this.microSmallAndMediumEnterprises = this.pslDataForm.get('microSmallAndMediumEnterprises');
  
      if(this.activityChange==='1PSLACTVTY') {
        this.formValues = this.pslDataForm.get('agriculture').value;
        console.log('formValues--------', this.formValues);
        if(!this.formValues.pslCCertificate) {
          return;
        }
        this.formValues.pslCCertificate = this.data[0].key;
        const data = {
          userId: localStorage.getItem('userId'),
          leadId: this.leadId,
          pslData: {
            ...this.formValues,
            landArea: Number(this.formValues.landArea)
            // landHolding: Number(this.formValues.landHolding)
          }
        };
        if(this.agriculture.valid === true) {
          this.pslDataService.saveOrUpadtePslData(data).subscribe((res:any) => {
            const response = res;
            // this.pslId = response.ProcessVariables.pslId;
            console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);  
            if(response["Error"] == 0) {
              this.toasterService.showSuccess(
                'PSL DATA Saved Successfully',
                ''
              );
            } 
          }); 
        } else {
        this.toasterService.showError('Please fill all mandatory fields.', '');
        }
      } 
    else if(this.activityChange==='2PSLACTVTY') {
      this.formValues = this.pslDataForm.get('microSmallAndMediumEnterprises').value;
      console.log('formValues--------', this.formValues);
        if(!this.formValues.pslCCertificate) {
          return;
        }
        this.formValues.pslCCertificate = this.data[0].key;
        const data = {
          userId: localStorage.getItem('userId'),
          leadId: this.leadId,
          pslData: {
            ...this.formValues,
            loanAmount: Number(this.formValues.loanAmount),
            udinNo: Number(this.formValues.udinNo),
            caCertifiedAmount: Number(this.formValues.caCertifiedAmount),
            otherInvestmentCost: Number(this.formValues.otherInvestmentCost),
            totalInvestment: Number(this.formValues.totalInvestmentCost)
          }    
        };
          // const data = this.pslDataForm.get('microSmallAndMediumEnterprises').value;
        if(this.microSmallAndMediumEnterprises.valid === true ) {
          this.pslDataService.saveOrUpadtePslData(data).subscribe((res:any) => {
            const response = res;
            console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);  
            if(response["Error"] == 0) {
              this.toasterService.showSuccess(
                'PSL DATA Saved Successfully',
                ''
              );
            } 
          });
        }
        else {
        this.toasterService.showError('Please fill all mandatory fields.', '');
      }
    } 
  }

  onFormSubmit() {
    this.saveOrUpdatePslData();
    const formModel = this.pslDataForm.value;
    const pslDataFormModel = { ...formModel };
    // console.log("PSL_DATA_FORM", pslDataFormModel);
    // this.ddeStoreService.setPslData(pslDataFormModel);
    // this.router.navigate(["/pages/dde/vehicle-valuation"]);
  }

  navigateNext() {
    this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
  }

  onBack() {
    this.router.navigate([`/pages/dde/${this.leadId}/income-details`]);
  }

}
