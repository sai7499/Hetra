import { Component, OnInit, OnChanges } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { LabelsService } from "@services/labels.service";
import { CommomLovService } from "@services/commom-lov-service";
import { DdeStoreService } from "@services/dde-store.service";
import { PslDataService } from "./psl-data.service";

@Component({
  selector: "app-psl-data",
  templateUrl: "./psl-data.component.html",
  styleUrls: ["./psl-data.component.css"],
})
export class PslDataComponent implements OnInit, OnChanges {
  pslDataForm: FormGroup;

  labels: any = {};
  LOV: any = [];
  test: any;

  pslData: any = [];
  pslDataObj: any= {};
  
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

  landAreaInAcresValueMap: number = 0;
  landAreaInAcresValue: number = 0;
  pslSubCategoryValueMap: any = [];

  pslLandHoldingChange: string;
  farmerTypeValues: any = [];
  isLandHoldingYes: boolean;
  landProofValues: any = [];

  showInputFieldsCA: boolean;
  showInputFieldsInvestments: boolean;
  isInvestmentInEquipment: boolean;
  isInvestmentInPlantMachinery: boolean;

  investmentInEquipmentValue: number;
  investmentInEquipmentValueMap: any = [];
  investmentInEquipmentMachineryValue: number;
  investmentInEquipmentMachineryMap: any = [];

  caCertifiedAmount: number;
  otherInvestmentCost: number;
  totalInvestmentCost: number;

  pslLandHolding: any = [
    { key: 1, value: "Yes" },
    { key: 2, value: "No" },
  ];

  constructor(
    private _fb: FormBuilder,
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private pslDataService: PslDataService,
    private ddeStoreService: DdeStoreService,
    private router: Router
  ) {}

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    this.getDependentDropdownLOV();
    this.getPslData();
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

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log("PSL DATA LOV  ---", this.LOV);
  }

  initForm() {
    this.pslDataForm = this._fb.group({
      activity: [""],
      agriculture: this._fb.group({
        detailActivity: [""],
        purposeOfLoanAg: [""],
        landHolding: [""],
        landOwner: [""],
        relWithLandowner: [""],
        farmerType: [""],
        landAreaInAcres: [""],
        landProof: [""],
        landProofUpload: [""],
        pslCategoryAg: [""],
        pslSubCategoryAg: [""],
        pslCertificateAg: [""],
        weakerSectionAg: [""],
      }),
      microSmallAndMediumEnterprises: this._fb.group({
        detailActivity: [""],
        goodsManufactured: [""],
        typeOfService: [""],
        purposeOfLoanMsme: [""],
        businessActivity: [""],
        loanAmount: [""],
        proofOfInvestment: [""],
        proofOfInvestmentUpload: [""],
        nameOfCa: [""],
        nameOfCaFirm: [""],
        caRegistrationNo: [""],
        udinNo: [""],
        caCertifiedAmount: [""],
        otherInvestmentCost: [""],
        totalInvestmentCost: [""],
        investInEquipment: [""],
        investmentInPlantMachinery: [""],
        pslCategoryMsme: [""],
        pslSubCategoryMsme: [""],
        pslCertificateMsme: [""],
        weakerSectionMsme: [""],
      }),
      housing: this._fb.group({
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
        pslCategoryHouse: [""],
        pslCertificateHouse: [""],
      }),
      // socialInfrastructure: this._fb.group({
      //   detailActivity: [""],
      //   goodsManufactured: [""],
      //   typeOfService: [""],
      //   purposeOfLoanAg: [""],
      //   purposeOfLoanMsme: [""],
      //   businessActivity: [""],
      //   landHolding: [""],
      //   landOwner: [""],
      //   relWithLandowner: [""],
      //   farmerType: [""],
      //   landAreaInAcres: [""],
      //   landProof: [""],
      //   landProofUpload: [""],
      //   loanAmount: [""],
      //   proofOfInvestment: [""],
      //   proofOfInvestmentUpload: [""],
      //   nameOfCa: [""],
      //   nameOfCaFirm: [""],
      //   caRegistrationNo: [""],
      //   udinNo: [""],
      //   caCertifiedAmount: [""],
      //   otherInvestmentCost: [""],
      //   totalInvestmentCost: [""],
      //   investInEquipment: [""],
      //   investmentInPlantMachinery: [""],
      //   pslCategoryAg: [""],
      //   pslCategoryMsme: [""],
      //   pslSubCategoryAg: [""],
      //   pslSubCategoryMsme: [""],
      //   pslCertificateAg: [""],
      //   pslCertificateMsme: [""],
      //   weakerSectionAg: [""],
      //   weakerSectionMsme: [""],
      // }),
      otherOption: this._fb.group({
        propertyType: [""],
        detailActivity: [""],
        goodsManufactured: [""],
        typeOfService: [""],
        purposeOfLoanAg: [""],
        purposeOfLoanMsme: [""],
        businessActivity: [""],
        landHolding: [""],
        landOwner: [""],
        relWithLandowner: [""],
        farmerType: [""],
        landAreaInAcres: [""],
        landProof: [""],
        landProofUpload: [""],
        loanAmount: [""],
        proofOfInvestment: [""],
        proofOfInvestmentUpload: [""],
        nameOfCa: [""],
        nameOfCaFirm: [""],
        caRegistrationNo: [""],
        udinNo: [""],
        caCertifiedAmount: [""],
        otherInvestmentCost: [""],
        totalInvestmentCost: [""],
        investInEquipment: [""],
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
        pslConsiderCost: [""],
        pslCategoryAg: [""],
        pslCategoryMsme: [""],
        pslCategoryHos: [""],
        pslSubCategoryAg: [""],
        pslSubCategoryMsme: [""],
        pslCertificateAg: [""],
        pslCertificateMsme: [""],
        pslCertificateHos: [""],
        weakerSectionAg: [""],
        weakerSectionMsme: [""],
      }),
    });
  }

  getDependentDropdownLOV() {
    this.pslDataService.getDependentDropdownLOV().subscribe((res: any) => {
      console.log("RESPONSE FROM APPIYO_SERVER_PSLDATA_Dependent_LOVS_API_RESPONSE", res);
      const response = res.ProcessVariables.pslDataLovObj;
      console.log("PSLDATA_Dependent_LOVS_API", response);
      this.pslDependentLOVSData = response;
    });
  }

  getPslData() {
    this.pslDataService.getPslData().subscribe((res: any) => {
      console.log("RESPONSE FROM APPIYO_SERVER_GET_PSL_DATA_API", res);
      const response = res.ProcessVariables.pslData;
      console.log("GET_PSL_DATA_API", response);
      this.pslDataObj = response;
    });    
  }

  onActivityChange(event: any) {
    this.detailActivityValues = [];
    this.activityChange = event.target.value;
    console.log("ACTIVITY_CHANGE----", this.activityChange);

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

      //To filter unique value in Array
      let detailActivityObject = {};
      const detailActivityData = [];
      this.detailActivityValues.forEach((element) => {
        if (!detailActivityObject[element.key]) {
          detailActivityObject[element.key] = true;
          detailActivityData.push(element);
        }
      });
      console.log("DETAILACTIVITY_DATA", detailActivityData);
      this.detailActivityChangeValues = detailActivityData;
    });

    if (this.detailActivityValues.length === 0) {
      this.detailActivityValues = [{ key: null, value: "Not Applicable" }];
    }
    //SHOW ALL OPTIONS_MSME
    this.showInputFieldsCA = true;
    this.showInputFieldsInvestments = true;

    this.isInvestmentInEquipment = true;
    this.isInvestmentInPlantMachinery = true;

    this.isLandHoldingYes = true;
    this.isGoosManufactured = true;
  }
isGoosManufactured: boolean;
  onChangeDetailActivity(event: any) {
    this.endUseValues = [];
    this.detailActivityChange = event.target.value;
    console.log("DETAILACTIVITY_CHANGE ----", this.detailActivityChange);

    this.pslDependentLOVSData.map((element) => {
      if (element.dltActivityId === this.detailActivityChange) {
        console.log("RELATED_ENDUSE_NAME --", element.endUseName);
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
        this.typeOfService = [{ key: null, value: 'Not Applicable'}];
        this.isGoosManufactured = true;
      }
    });

    if (this.detailActivityChange === "2PSLDTLACTVTY") {
      this.pslLandHolding = [{ key: 2, value: "No" }];
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
        { key: 2, value: "No" },
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

  onChangePslSubCategory(event: any) {
    this.pslSubCategoryChange = event.target.value;
    console.log("PSL_SUBCATEGORY_ID", this.pslSubCategoryChange);
    if (this.pslSubCategoryChange === "2PSLSUBCAT") {
      const data = [
        {
          key: this.LOV.LOVS.pslCertificate[0].key,
          value: this.LOV.LOVS.pslCertificate[0].value,
        },
      ];
      this.pslCertificateValues = data;
    } else if (this.pslSubCategoryChange === "1PSLSUBCAT") {
      const data = [
        {
          key: this.LOV.LOVS.pslCertificate[1].key,
          value: this.LOV.LOVS.pslCertificate[1].value,
        },
      ];
      this.pslCertificateValues = data;
    } else if (this.pslSubCategoryChange === "3PSLSUBCAT") {
      const data = [
        {
          key: this.LOV.LOVS.pslCertificate[2].key,
          value: this.LOV.LOVS.pslCertificate[2].value,
        },
      ];
      this.pslCertificateValues = data;
    }
    //FOR PSL_SUBCATEGORY AS MICRO
    else if (
      this.pslSubCategoryChange === "7PSLSUBCAT" ||
      this.pslSubCategoryChange === "4PSLSUBCAT"
    ) {
      const data = [
        {
          key: this.LOV.LOVS.pslCertificate[3].key,
          value: this.LOV.LOVS.pslCertificate[3].value,
        },
      ];
      this.pslCertificateValues = data;
    } else {
      const data = [
        {
          key: this.LOV.LOVS.pslCertificate[4].key,
          value: this.LOV.LOVS.pslCertificate[4].value,
        },
      ];
      this.pslCertificateValues = data;
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
      this.weakerSectionValues = [{ key: null, value: "Not Applicable" }];
    }
  }

  // onChangePslCertificate (event:any) {
  //   let pslCerticateChange = event.target.value;
  //   console.log("PSL_CERTIFICATE_CHANGE_ID--", pslCerticateChange);
  //   if (this.pslSubCategoryChange === "1PSLSUBCAT" || this.pslSubCategoryChange === "2PSLSUBCAT") {
  //     const data = [
  //       {
  //         key: this.LOV.LOVS.weakerSection[0].key,
  //         value: this.LOV.LOVS.weakerSection[0].value,
  //       }
  //     ];
  //     this.weakerSectionValues = data;
  //   }

  // }

  // Chnage in PSL_SUBCATEGORY BASED UPON INPUT VALUE IN LANDAREAINACRES
  onLandAreaChange(event: any) {
    let landAreaChange = event.target.value;
    this.pslSubCategoryValueMap = this.LOV.LOVS.pslSubCategory;
    this.landAreaInAcresValueMap = this.pslSubCategoryValueMap.filter(
      (element) => {
        if (this.landAreaInAcresValue <= 2.5) {
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
  }

  onChangeInvestmentInEquipment(event: any) {
    let investmentInEquipmentChange = event.target.value;
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
  }

  onChangeInvestmentInEquipmentAndMachinery(event: any) {
    let investmentInEquipmentMachineryChange = event.target.value;
    this.pslSubCategoryValueMap = this.LOV.LOVS.pslSubCategory;

    this.investmentInEquipmentMachineryMap = this.pslSubCategoryValueMap.filter(
      (element) => {
        if (this.investmentInEquipmentMachineryValue <= 2500000) {
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
          this.investmentInEquipmentMachineryValue > 2500000 &&
          this.investmentInEquipmentMachineryValue <= 50000000
        ) {
          const data = [
            {
              key: this.LOV.LOVS.pslSubCategory[8].key,
              value: this.LOV.LOVS.pslSubCategory[8].value,
            },
          ];
          this.pslSubCategoryValues = data;
        } else if (
          this.investmentInEquipmentMachineryValue > 50000000 &&
          this.investmentInEquipmentMachineryValue <= 100000000
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
  }

  onChangeProofOfInvestment(event: any) {
    this.proofOfInvestmentChange = event.target.value;
    console.log("ProofOfInvestment_ID", this.proofOfInvestmentChange);

    if (this.proofOfInvestmentChange === "1PSLINVSTPRF") {
      this.showInputFieldsCA = true;
    } else {
      this.showInputFieldsCA = false;
    }

    if (
      this.proofOfInvestmentChange === "2PSLINVSTPRF" ||
      this.proofOfInvestmentChange === "3PSLINVSTPRF" ||
      this.proofOfInvestmentChange === "4PSLINVSTPRF"
    ) {
      this.showInputFieldsInvestments = true;
    } else {
      this.showInputFieldsInvestments = false;
    }
  }

  onChangePslLandHolding(event: any) {
    this.pslLandHoldingChange = event.target.value;
    console.log("PSL_LANDHOLDING_CHANGE_ID-----", this.pslLandHoldingChange);
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
    } else if (this.pslLandHoldingChange === "2") {
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
    console.log("FARMER_TYPE_VALUES---", this.farmerTypeValues);
  }

  onChangeCaCertifiedAmount(event:any) {
    let key = event.target.value;
    if(this.caCertifiedAmount===0 || this.otherInvestmentCost===0) {
      this.totalInvestmentCost = 0;
      console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    } 
    else if(this.caCertifiedAmount===0) {
      this.totalInvestmentCost = 0;
    } 
    else {
      this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
    }
    console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  }

  onChangeOtherInvestmentCost(event:any) {
    let key = event.target.value;
    if(this.caCertifiedAmount===0 || this.otherInvestmentCost===0) {
      this.totalInvestmentCost = 0;
      // console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    }   else if(this.otherInvestmentCost===0 && this.caCertifiedAmount===0) {
      this.totalInvestmentCost = 0;
      console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
    }
    else {
      this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
    }
    console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  }

  // autoSumTotalInvestment(value1, value2) {
  //   if(this.caCertifiedAmount===0 || this.otherInvestmentCost===0) {
  //     this.totalInvestmentCost = 0;
  //     console.log("TOTAL_INVESTMENT_COST", this.totalInvestmentCost);
  //   } else {
  //     this.totalInvestmentCost = this.caCertifiedAmount + this.otherInvestmentCost;
  //   }
  // }

  saveOrUpdatePslData() {
    const data = this.pslData;
    this.pslDataService.saveOrUpadtePslData(data).subscribe((res:any) => {
      const response = res;
      console.log("PSL_DATA_RESPONSE_SAVE_OR_UPDATE_API", response);      
    });
  }

  onFormSubmit() {
    this.saveOrUpdatePslData();
    const formModel = this.pslDataForm.value;
    const pslDataFormModel = { ...formModel };
    console.log("PSL_DATA_FORM", pslDataFormModel);
    
    // this.ddeStoreService.setPslData(pslDataFormModel);
    this.router.navigate(["/pages/dde/vehicle-valuation"]);
  }
}
