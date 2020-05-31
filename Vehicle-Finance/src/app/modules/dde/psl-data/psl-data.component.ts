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
  test: any;
  activityChange: string = "";
  detailActivityChange: string;
  LOV: any = [];

  pslDependentLOVSData: any = [];
  detailActivityValues: any = [];
  detailActivityChangeValues: any = [];
  endUseValues: any = [];

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
    this.getLabels();
    this.getLOV();
    this.initForm();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
    });
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
      socialInfrastructure: this._fb.group({
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
        pslCategoryAg: [""],
        pslCategoryMsme: [""],
        pslSubCategoryAg: [""],
        pslSubCategoryMsme: [""],
        pslCertificateAg: [""],
        pslCertificateMsme: [""],
        weakerSectionAg: [""],
        weakerSectionMsme: [""],
      }),
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
      console.log("RESPONSE FROM APPIYO_SERVER", res);
      const response = res.ProcessVariables.pslDataLovObj;
      console.log("PSLDATA Dependent_LOVS", response);
      this.pslDependentLOVSData = response;
    });
  }

  onActivityChange(event: any) {
    this.detailActivityValues = [];
    this.activityChange = event.target.value;
    console.log("ACTIVITY_CHANGE----", this.activityChange);
    let count = 0;
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
  }

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
    });
  }

  onFormSubmit() {
    const formModel = this.pslDataForm.value;
    const pslDataModel = { ...formModel };
    // this.ddeStoreService.setPslData(pslDataModel);
    this.router.navigate(["/pages/dde/vehicle-valuation"]);
  }
}
