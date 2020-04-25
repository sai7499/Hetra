import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { DdeStoreService } from '@services/dde-store.service';

@Component({
  selector: 'app-psl-data',
  templateUrl: './psl-data.component.html',
  styleUrls: ['./psl-data.component.css']
})
export class PslDataComponent implements OnInit {

  public pslDataForm: FormGroup;

  public pslDataLov: any = {};
  public labels: any = {};
  public errorMsg;
  public getLabels;
  
  public show: boolean = false;
  public showOption: boolean = false;
  public showAct: boolean = false;
  public showMs: boolean = false;
  public showHs: boolean = false;
  public showLoan: boolean = false;
  public show3: boolean = false;
  public show4: boolean = false;
  public show5: boolean = false;

  public detailActivity:any = [];
  public purposeLoan: any = [];
  public purLoanMs: any;
  public typeService: any = [];

  constructor( private labelsData: LabelsService, 
               private lovDataService: LovDataService,
               private ddeStoreService: DdeStoreService,
               private router: Router ) { }

  ngOnInit() {
    this.initForm();
    
    this.getLabels = this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
      
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.pslDataLov = value ? value[0].pslData[0] : {};
      console.log('PslDataLovs:', this.pslDataLov);
      this.setFormValue();
    });
    this.detailActivity = [];
  }

  initForm() {
    this.pslDataForm = new FormGroup({
      activity: new FormControl(''),
      propertyType: new FormControl(''),
      detailActivity: new FormControl(''),
      goodsManufactured: new FormControl(''),
      typeOfService: new FormControl(''),
      purposeOfLoanAg: new FormControl(''),
      purposeOfLoanMsme: new FormControl(''),
      businessActivity: new FormControl(''),
      landHolding: new FormControl(''),
      landOwner: new FormControl(''),
      relWithLandowner: new FormControl(''),
      farmerType: new FormControl(''),
      landAreaInAcres: new FormControl(''),
      landProof: new FormControl(''),
      landProofUpload: new FormControl(''),
      loanAmount: new FormControl(''),
      proofOfInvest: new FormControl(''),
      investProofUpload: new FormControl(''),
      nameOfCa: new FormControl(''),
      nameOfCaFirm: new FormControl(''),
      caRegisterNo: new FormControl(''),
      udinNo: new FormControl(''),
      caCertifiedAmount: new FormControl(''),
      otherInvestmentCost: new FormControl(''),
      totalInvestmentCost: new FormControl(''),
      investInEquipment: new FormControl(''),
      investPlantMachinery: new FormControl(''),
      cityTier: new FormControl(''),
      investmentSocialInfra: new FormControl(''),
      investmentOtherBank: new FormControl(''),
      totalInvestment: new FormControl(''),
      propertyLocatedCity: new FormControl(''),
      propertyLocation: new FormControl(''),
      propertyPincode: new FormControl(''),
      landAmount: new FormControl(''),
      landCost: new FormControl(''),
      constructionCost: new FormControl(''),
      totalPropertyCost: new FormControl(''),
      registrationCost: new FormControl(''),
      pslConsiderCost: new FormControl(''),
      pslCategoryAg: new FormControl(''),
      pslCategoryMsme: new FormControl(''),
      pslCategoryHos: new FormControl(''),
      pslSubCategoryAg: new FormControl(''),
      pslSubCategoryMsme: new FormControl(''),
      pslCertificateAg: new FormControl(''),
      pslCertificateMsme: new FormControl(''),
      pslCertificateHos: new FormControl(''),
      weakerSectionAg: new FormControl(''),
      weakerSectionMsme: new FormControl('')
    });
  }

  setFormValue(){
    const pslDataModel = this.ddeStoreService.getPslData() || {};
    console.log('PSL Data', pslDataModel);

    this.pslDataForm.patchValue({
      activity: pslDataModel.activity || '',
      propertyType: pslDataModel.propertyType || '',
      detailActivity: pslDataModel.detailActivity || '',
      goodsManufactured: pslDataModel.goodsManufactured || '',
      typeOfService: pslDataModel.typeOfService || '',
      purposeOfLoanAg: pslDataModel.purposeOfLoanAg || '',
      purposeOfLoanMsme: pslDataModel.purposeOfLoanMsme || '',
      businessActivity: pslDataModel.businessActivity || '',
      landHolding: pslDataModel.landHolding || '',
      landOwner: pslDataModel.landOwner || '',
      relWithLandowner: pslDataModel.relWithLandowner || '',
      farmerType: pslDataModel.farmerType || '',
      landAreaInAcres: pslDataModel.landAreaInAcres || '',
      landProof: pslDataModel.landProof || '',
      landProofUpload: pslDataModel.landProofUpload || '',
      loanAmount: pslDataModel.loanAmount || '',
      proofOfInvest: pslDataModel.proofOfInvest || '',
      investProofUpload: pslDataModel.investProofUpload || '',
      nameOfCa: pslDataModel.nameOfCa || '',
      nameOfCaFirm: pslDataModel.nameOfCaFirm || '',
      caRegisterNo: pslDataModel.caRegisterNo || '',
      udinNo: pslDataModel.udinNo || '',
      caCertifiedAmount: pslDataModel.caCertifiedAmount || '',
      otherInvestmentCost: pslDataModel.otherInvestmentCost || '',
      totalInvestmentCost: pslDataModel.totalInvestmentCost || '',
      investInEquipment: pslDataModel.investInEquipment || '',
      investPlantMachinery: pslDataModel.investPlantMachinery || '',
      cityTier: pslDataModel.cityTier || '',
      investmentSocialInfra: pslDataModel.investmentSocialInfra || '',
      investmentOtherBank: pslDataModel.investmentOtherBank || '',
      totalInvestment: pslDataModel.totalInvestment || '',
      propertyLocatedCity: pslDataModel.propertyLocatedCity || '',
      propertyLocation: pslDataModel.propertyLocation || '',
      propertyPincode: pslDataModel.propertyPincode || '',
      landAmount: pslDataModel. landAmount|| '',
      landCost: pslDataModel.landCost || '',
      constructionCost: pslDataModel.constructionCost || '',
      totalPropertyCost: pslDataModel.totalPropertyCost || '',
      registrationCost: pslDataModel.registrationCost || '',
      pslConsiderCost: pslDataModel.pslConsiderCost || '',
      pslCategoryAg: pslDataModel.pslCategoryAg || '',
      pslCategoryMsme: pslDataModel.pslCategoryMsme || '',
      pslCategoryHos: pslDataModel.pslCategoryHos || '',
      pslSubCategoryAg: pslDataModel.pslSubCategoryAg || '',
      pslSubCategoryMsme: pslDataModel.pslSubCategoryMsme || '',
      pslCertificateAg: pslDataModel.pslCertificateAg || '',
      pslCertificateMsme: pslDataModel.pslCertificateMsme || '',
      pslCertificateHos: pslDataModel.pslCertificateHos || '',
      weakerSectionAg: pslDataModel.weakerSectionAg || '',
      weakerSectionMsme: pslDataModel.weakerSectionMsme || ''
    });
  }
 
  onChangeActivity(event) {
    console.log("Key", event.target.value);
    if(event.target.value==="1") {
      this.show = true;
      this.showAct = false;
      this.showOption  = true;
      this.showMs = false;
      this.showHs = false;
      this.showLoan = true;
      this.show3 = false;
      this.show4 = false;
      this.detailActivity = this.pslDataLov.detailActivity[0].value;
    } 
    else if(event.target.value==="2") {
      this.show = false;
      this.showAct = true;
      this.show3 = true;
      this.showOption  = true;
      this.showMs = true;
      this.showHs = false;
      this.showLoan = false;
      this.show4 = false;
      this.detailActivity = this.pslDataLov.detailActivity[1].value;
      this.purLoanMs = this.pslDataLov.purposeLoan[4].value;
    } 
    else if(event.target.value==="3") {
      this.show = true;
      this.showAct = true;
      this.showOption  = true;
      this.showMs = false;
      this.showHs = true;
      this.showLoan = false;
      this.show3 = false;
      this.show4 = false;
      this.detailActivity = this.pslDataLov.detailActivity[2].value;
    } 
    else if (event.target.value==="4") {
      this.show = false;
      this.showAct = false;
      this.show3 = true;
      this.showOption  = true;
      this.showMs = true;
      this.showHs = false;
      this.showLoan = true;
      this.show4 = true;
      this.detailActivity = this.pslDataLov.detailActivity[0].value;
      this.purLoanMs = this.pslDataLov.purposeLoan[4].value;
    } 
    else if (event.target.value==="5" || event.target.value==="6" || event.target.value==="7" || event.target.value==="8" ) {
      this.show = false;
      this.showAct = false;
      this.show3 = true;
      this.showOption  = true;
      this.showMs = true;
      this.showHs = false;
      this.showLoan = true;
      this.show4 = true;
      this.detailActivity = this.pslDataLov.detailActivity[0].value;
      this.purLoanMs = this.pslDataLov.purposeLoan[4].value;
    }
    else {
      this.show = false;
      this.showAct = false;
      this.showOption  = false;
      this.showMs = true;
      this.showHs = true;
      this.showLoan = true;
      this.show3 = true;
      this.show4 = true;
      // this.detailActivity = this.pslDataLov.detailActivity[3].value;
      this.detailActivity = [];
    }
  }

  onChangeDetailActivity(event) {
    console.log("KEY", event.target.value);
    
    if(event.target.value==="Agriculture") {
      this.showOption = true;
      this.purposeLoan = this.pslDataLov.purposeLoan[0].value;
      // console.log("OnChangeDetailAct", this.purposeLoan);
    } 
    else if(event.target.value==="Allied Activities") {
      this.showOption  = true;
      this.purposeLoan = this.pslDataLov.purposeLoan[1].value;
    } 
    else if(event.target.value==="Agriculture Infrastructure") {
      this.showOption  = true;
      this.purposeLoan = this.pslDataLov.purposeLoan[2].value;
    } 
    else if (event.target.value==="Ancilary activities") {
      this.showOption  = true;
      this.purposeLoan = this.pslDataLov.purposeLoan[3].value;
    } 
    else if (event.target.value==="Manufacturing") {
      this.showOption  = true;
      this.typeService = this.pslDataLov.typeService[0].value;
      this.purposeLoan = this.pslDataLov.purposeLoan[5].value;
    }
    else if (event.target.value==="Service") {
      this.showOption  = true;
      this.typeService = this.pslDataLov.typeService[0].value;
      this.purposeLoan = this.pslDataLov.purposeLoan[4].value;
    }
    else {
      this.purposeLoan = [];
      this.showMs = false;
      this.typeService =[];
    }
  }

   onFormSubmit() {
    const formModel = this.pslDataForm.value;
    const pslDataModel = {...formModel};
    // this.ddeStoreService.setPslData(pslDataModel);
    this.router.navigate(['/pages/dde/vehicle-valuation']);
  }

}
