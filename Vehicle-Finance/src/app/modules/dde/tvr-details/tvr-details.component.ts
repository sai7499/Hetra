import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TvrDetailsService } from '@services/tvr/tvr-details.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-tvr-details',
  templateUrl: './tvr-details.component.html',
  styleUrls: ['./tvr-details.component.css']
})
export class TvrDetailsComponent implements OnInit {
  labels: any = {};
  leadId;
  applicantId;
  productCatCode: string;
  tabName : any = {};

  isChildLoan: any;
  productId: any;

  tvrVerfiedLov = [
    { key: "Y", value: "Yes" },
    {key: "N", value: "No"}
  ];
  tvrVerfiedAddLov = [
    { key: "Y", value: "Yes" },
    { key: "N", value: "No" },
    { key: "NA", value: "Not Applicable" }
  ];
  isDirty;  
  tvrForm: FormGroup;
  GuarantorDetails: any;
  CoApplicantDetails: any;
  AssetDetailsList: any;
  TVRMainDetails:any;
  detailsSaved: boolean;
  LMSProductCode: string;
  ucvProduct: boolean = false;
  tcrProduct: boolean = false;
  ncvProduct: boolean = false;
  cvProduct: boolean = false;
  SpokenToLOV: any;
  RefinanceLOV: any;
  EMICycleLOV: any;
  EmployeeTypeLOV: any;
  AnyOtherLoanLOV: any;
  VehiclePurchasedFromLOV: any;
  ReferenceStatusLOV: any;

  constructor(
    private fb: FormBuilder,
    private labelDetails: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tvrService: TvrDetailsService,
    private sharedService: SharedService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService,
  ) { }

  async ngOnInit() {
    this.loadForm();
    this.tabName = this.sharedService.getTabName();
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.getLeadId(); //existing
    this.leadId = (await this.getLeadId()) as number;
    console.log(this.leadId);
    //this.leadId = 4766;
    this.getLeadSectiondata();//existing    
    this.getLabels();
    this.onChangeLanguage('English');
    this.getLov();
    this.getTvrDetails();
  }

  onChangeLanguage(labels: string) {
    if (labels === 'Hindi') {
      this.labelDetails.getLanguageLabelData().subscribe((data) => {
        this.labels = data[0];
      });
    } else {
      this.labelDetails.getLabelsData().subscribe((data) => {
        this.labels = data;
      });
    }
  }
  getLabels() {
    this.labelDetails.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
    ); ''
  }

  getLeadId() {//existing
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  
  // async onViewClick(applicantId: string, applicantType: string) {

  //   const leadId = (await this.getLeadId()) as number;
  //   this.router.navigateByUrl(`pages/tvr-details/${leadId}/tele-verification-form/${applicantType}/${applicantId}`);
  // }

  //GET LEAD SECTION DATA
  getLeadSectiondata() { //existing
    const leadData = this.createLeadDataService.getLeadSectionData();
    if (leadData['leadDetails']) {
      this.isChildLoan = leadData['leadDetails'].isChildLoan;
      this.productId = leadData['leadDetails'].productId;
    }
    this.productCatCode = leadData['leadDetails'].productCatCode;
    console.log("PRODUCT_CODE::", this.productCatCode);
  }

  onBack() { //existing
    if (this.isChildLoan === '1') {
      if ((this.productId === '1078') || (this.productId === '1079') || (this.productId === '1080')) {
        this.router.navigate([`/pages/dde/${this.leadId}/vehicle-valuation`]);
      } else {
        this.router.navigate(['pages/dde/' + this.leadId + '/psl-data']);
      }
    } else if ((this.isChildLoan === '0')) {
   
    if (this.productCatCode == 'UCV' || this.productCatCode == 'UC') {
      this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-valuation']);
      
    }else{
      this.router.navigate(['pages/dde/' + this.leadId + '/psl-data']);
    }
  }
    this.sharedService.getPslDataNext(false);


  }

  onNext() {//existing
    if (this.productCatCode == 'UC') {
      this.router.navigate(['pages/dde/' + this.leadId + '/rcu']);
    } else {
      if (this.tabName['isFI']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/fi-list']);
      } else if (this.tabName['isPD']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      }else if (this.tabName['isFiCumPD']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
      }else if (this.tabName['isVV']) {
        this.router.navigate(['pages/dde/' + this.leadId + '/viability-list']);
      }else {
        this.router.navigate(['pages/dde/' + this.leadId + '/cibil-od']);
      }
    }

  }


  //new code revamp starts
  getLov() {
    this.tvrService
      .getTvrLov(this.leadId).subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
         
          this.AnyOtherLoanLOV = res.ProcessVariables.AnyOtherLoanLOV;
          this.EMICycleLOV = res.ProcessVariables.EMICycleLOV;
          this.EmployeeTypeLOV = res.ProcessVariables.EmployeeTypeLOV;
          this.RefinanceLOV = res.ProcessVariables.RefinanceLOV;
          this.SpokenToLOV = res.ProcessVariables.SpokenTo;
          this.ReferenceStatusLOV = res.ProcessVariables.ReferenceStatusLOV;
          this.VehiclePurchasedFromLOV = res.ProcessVariables.VehiclePurchasedFromLOV;

        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }

  loadForm(){
      this.tvrForm = this.fb.group({
        assetDetails: new FormArray([]), // assetDetails
        coAppDetails: new FormArray([]), //coApplicant
        gurantorDetails: new FormArray([]), //gurantor
      
        //object key starts
        applicationNumber:[{value:'',disabled:true}],
        applicantID:[''],
        entityTypeDesc:[{value:'',disabled:true}],
        entityType:[{value:'',disabled:true}],
        customerName:[{value:'',disabled:true}],
        mobileNumber:[{value:'',disabled:true}],
        dob:[{value:'',disabled:true}],
        soEmpIdName:[{value:'',disabled:true}],
        sourcingTypeDesc:[{value:'',disabled:true}],
        sourcingType:[{value:'',disabled:true}],
        productCategory:[{value:'',disabled:true}],
        productName:[{value:'',disabled:true}], 
        productID:[{value:'',disabled:true}],

        
        marginMoney: [{value:'',disabled:true}],
        dealerName: [{value:'',disabled:true}],
        discountOfferByDealer: [{value:'',disabled:true}],
        landHoldingDetails: [{value:'',disabled:true}],

        application_numberVerified:['',[Validators.required]],
        entityTypeVerified:['',[Validators.required]],
        applicantNameVerified:['',[Validators.required]],
        mobileNumberVerified:['',[Validators.required]],
        dobVerified:['',[Validators.required]],
        soEmpIdNameVerified:['',[Validators.required]],
        sourcingTypeVerified:[''],
        productCategoryVerified:['',[Validators.required]],
        productIdVerified:['',[Validators.required]],

        
        marginMoneyVerified: [''],
        dealerNameVerified: [''],
        landHoldingDetailsVerified: [''],

        //Applicant Residence Address Current
        // for both applicant & company same formControl names only based on entity it will get change
        currentAddress:[{value:'',disabled:true}],
        currentAddLandline:[{value:'',disabled:true}],
        currentAddressVerified:['',[Validators.required]],
        currentAddLandlineVerified:[''],
        //Applicant Residence Address Permanent
        permanentAddress:[''],
        permanentAddLandline:[{value:'',disabled:true}],
        permanentAddressVerified:['',[Validators.required]],
        permanentAddLandlineVerified:[''],
        
        //business Address
        isOfcAddApplicable:[{value:''}],
        officeAddress:[{value:'',disabled:true}],
        officeAddLandline:[{value:'',disabled:true}],
        alternateContactNumber:[{value:'',disabled:true}],
        designDesc:[{value:'',disabled:true}],
        designation:[{value:'',disabled:true}],
        natureOfBusiness:[{value:'',disabled:true}],
        noOfWorkingEmployees:[{value:'',disabled:true}],

        officeAddressVerified:[''],
        officeAddLandlineVerified:[''],
        alternateContactNumberVerified:[''],
        designationVerified:[''],
        natureOfBusinessVerified:[''],
        noOfWorkingEmployeesVerified:[''],
        //Designation
        monthlyIncomeAmount:[{value:'',disabled:true}],
        employerName:[{value:''}],
        employerType:[''],
        houseOwnership:[{value:'',disabled:true}],
        residenceDesc:[{value:'',disabled:true}],
        residentStatus:['',{disabled:true}],

        monthlyIncomeAmountVerified:[''],
        //employerNameVerified:[{value:''}],
        //employerTypeVerified:[{value:''}],
        customerProfileMatching:[''], // only yes no
        houseOwnershipVerified:[''],
        residentStatusVerified:['',[Validators.required]],

       
        remarks:[{value:'',disabled:false}],
        tvrDoneDate:[{value:'',disabled:true},[Validators.required]],
        tvrDoneByName:[{value:'',disabled:true},[Validators.required]],
        tvrDoneEmpID:[{value:'',disabled:true},[Validators.required]],
        tvrID:[''],


        //Reference Details
        referenceAddress1:[{value:'',disabled:true}],
        referenceAddress2:[{value:'',disabled:true}],
        referenceContactNo1:[{value:'',disabled:true}],
        referenceContactNo2:[{value:'',disabled:true}],
        referenceName1:[{value:'',disabled:true}],
        referenceName2:[{value:'',disabled:true}],
        
        referenceStatus1:[''],
        referenceStatus2:[''],
       
        //object key ends
        //coapplicant: new FormArray([]),
      })
  }

  get tvrFormDatas() { return this.tvrForm.controls; }
  get tvrAssetDetails() { return this.tvrFormDatas.assetDetails as FormArray; }
  get tvrCoApplicants() { return this.tvrFormDatas.coAppDetails as FormArray; }
  get tvrGurantors() { return this.tvrFormDatas.gurantorDetails as FormArray; }

  getTvrDetails() {
    this.tvrService
      .fetchTvrDetails(this.leadId)
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
                   
	        // if (res.ProcessVariables.fetchNegotiation) { 
          // else{
          // }
          this.detailsSaved = res.ProcessVariables.isTVRIdExists;
          this.AssetDetailsList = res.ProcessVariables.AssetDetails ? res.ProcessVariables.AssetDetails : [];
          this.CoApplicantDetails = res.ProcessVariables.CoApplicantDetails ? res.ProcessVariables.CoApplicantDetails : [];   
          this.GuarantorDetails = res.ProcessVariables.GuarantorDetails ? res.ProcessVariables.GuarantorDetails : [];
          this.TVRMainDetails = res.ProcessVariables.TVRMainDetails;
         if(this.TVRMainDetails){
          this.tvrForm.patchValue({
            applicationNumber:this.TVRMainDetails.applicationNumber,
            applicantID:this.TVRMainDetails.applicantID,
        entityTypeDesc:this.TVRMainDetails.entityTypeDesc,
        entityType:this.TVRMainDetails.entityType,
        customerName:this.TVRMainDetails.customerName,
        mobileNumber:this.TVRMainDetails.mobileNumber,
        dob:this.TVRMainDetails.dob,
        soEmpIdName:this.TVRMainDetails.soEmpIdName,
        sourcingTypeDesc:this.TVRMainDetails.sourcingTypeDesc,
        sourcingType:this.TVRMainDetails.sourcingType,
        productCategory:this.TVRMainDetails.productCategory,
        productName:this.TVRMainDetails.productName,
        productID:this.TVRMainDetails.productID, 
            //Applicant Residence Address Current
            // for both applicant & company same formControl names only based on entity it will get change
        currentAddress:this.TVRMainDetails.currentAddress,
        currentAddLandline:this.TVRMainDetails.currentAddLandline,
        permanentAddress:this.TVRMainDetails.permanentAddress,
        permanentAddLandline:this.TVRMainDetails.permanentAddLandline,
           //business Address
        isOfcAddApplicable:this.TVRMainDetails.isOfcAddApplicable,
        officeAddress:this.TVRMainDetails.officeAddress,
        officeAddLandline:this.TVRMainDetails.officeAddLandline,
        alternateContactNumber:this.TVRMainDetails.alternateContactNumber,
        designDesc:this.TVRMainDetails.designDesc,
        designation:this.TVRMainDetails.designation,
        natureOfBusiness:this.TVRMainDetails.natureOfBusiness,
        noOfWorkingEmployees:this.TVRMainDetails.noOfWorkingEmployees,
        //Designation
        monthlyIncomeAmount:this.TVRMainDetails.monthlyIncomeAmount,
        employerName:this.TVRMainDetails.employerName,
        employerType:this.TVRMainDetails.employerType,
        houseOwnership:this.TVRMainDetails.houseOwnership,
        residenceDesc:this.TVRMainDetails.residenceDesc,
        residentStatus:this.TVRMainDetails.residentStatus,
        landHoldingDetails:this.TVRMainDetails.landHoldingDetails,
        marginMoney:this.TVRMainDetails.marginMoney,
        dealerName:this.TVRMainDetails.dealerName,
        discountOfferByDealer:this.TVRMainDetails.discountOfferByDealer,
       
        remarks:this.TVRMainDetails.remarks,
        tvrDoneDate:this.TVRMainDetails.tvrDoneDate,
        tvrDoneByName:this.TVRMainDetails.tvrDoneByName,
        tvrDoneEmpID:this.TVRMainDetails.tvrDoneEmpID,
        tvrID:this.detailsSaved?this.TVRMainDetails.tvrID:null,

        //Reference Details
        referenceAddress1:this.TVRMainDetails.referenceAddress1,
        referenceAddress2:this.TVRMainDetails.referenceAddress2,
        referenceContactNo1:this.TVRMainDetails.referenceContactNo1,
        referenceContactNo2:this.TVRMainDetails.referenceContactNo2,
        referenceName1:this.TVRMainDetails.referenceName1,
        referenceName2:this.TVRMainDetails.referenceName2,
          });

          this.LMSProductCode = this.TVRMainDetails.productCategory;
            if(this.LMSProductCode){
              if(this.LMSProductCode == "UCV"){
                this.ucvProduct = true;
              } else if(this.LMSProductCode == "TCR") {
                this.tcrProduct = true;
              } else if(this.LMSProductCode == "NCV"){
                this.ncvProduct = true;
              } else if(this.LMSProductCode == "UC"){
                this.cvProduct = true;
              }
            }
    
          if(this.detailsSaved){
            this.tvrForm.patchValue({
          application_numberVerified:this.TVRMainDetails.application_numberVerified,
          entityTypeVerified:this.TVRMainDetails.entityTypeVerified,
          applicantNameVerified:this.TVRMainDetails.applicantNameVerified,
          mobileNumberVerified:this.TVRMainDetails.mobileNumberVerified,
          dobVerified:this.TVRMainDetails.dobVerified,
          soEmpIdNameVerified:this.TVRMainDetails.soEmpIdNameVerified,
          sourcingTypeVerified:this.TVRMainDetails.sourcingTypeVerified,
          productCategoryVerified:this.TVRMainDetails.productCategoryVerified,
          productIdVerified:this.TVRMainDetails.productIdVerified,
          landHoldingDetailsVerified:this.TVRMainDetails.landHoldingDetailsVerified,
          marginMoneyVerified:this.TVRMainDetails.marginMoneyVerified,
          dealerNameVerified:this.TVRMainDetails.dealerNameVerified,

          //Applicant Residence Address Current
          // for both applicant & company same formControl names only based on entity it will get change
          currentAddressVerified:this.TVRMainDetails.currentAddressVerified,
          currentAddLandlineVerified:this.TVRMainDetails.currentAddLandlineVerified,
          //Applicant Residence Address Permanent
          permanentAddressVerified:this.TVRMainDetails.permanentAddressVerified,
          permanentAddLandlineVerified:this.TVRMainDetails.permanentAddLandlineVerified,
         
          //business Address
          officeAddressVerified:this.TVRMainDetails.officeAddressVerified,
          officeAddLandlineVerified:this.TVRMainDetails.officeAddLandlineVerified,
          alternateContactNumberVerified:this.TVRMainDetails.alternateContactNumberVerified,
          designationVerified:this.TVRMainDetails.designationVerified,
          natureOfBusinessVerified:this.TVRMainDetails.natureOfBusinessVerified,
          noOfWorkingEmployeesVerified:this.TVRMainDetails.noOfWorkingEmployeesVerified,
          //Designation
         
          monthlyIncomeAmountVerified:this.TVRMainDetails.monthlyIncomeAmountVerified,
          // employerNameVerified:this.TVRMainDetails.employerNameVerified,
          // employerTypeVerified:this.TVRMainDetails.employerTypeVerified,
          customerProfileMatching:this.TVRMainDetails.customerProfileMatching, // only yes no
          houseOwnershipVerified:this.TVRMainDetails.houseOwnershipVerified,
          residentStatusVerified:this.TVRMainDetails.residentStatusVerified,
  
          referenceStatus1:this.TVRMainDetails.referenceStatus1,
          referenceStatus2:this.TVRMainDetails.referenceStatus2,
            }); 
          }
         }
         
          if (this.tvrAssetDetails.length < this.AssetDetailsList.length) {
            for (let i = this.tvrAssetDetails.length; i < this.AssetDetailsList.length; i++) {
                this.tvrAssetDetails.push(
                  this.fb.group({
                    assetCost: [{ value: this.AssetDetailsList[i].assetCost, disabled: true }],
                    collateralID:[{ value: this.AssetDetailsList[i].collateralID, disabled: true }],
                    requestedLoanAmount: [{ value: this.AssetDetailsList[i].requestedLoanAmount, disabled: true }],
                    tenureMonths: [{ value: this.AssetDetailsList[i].tenureMonths, disabled: true }],
                    vehicleTypeCode: [{ value: this.AssetDetailsList[i].vehicleTypeCode, disabled: true }],
                    vehicleMfrCode: [{ value: this.AssetDetailsList[i].vehicleMfrCode, disabled: true }],
                    vehicleModel: [{ value: this.AssetDetailsList[i].vehicleModel, disabled: true }],
                    requestedEmi: [this.detailsSaved? this.AssetDetailsList[i].requestedEmi : ''],
                    requestedEmiCycle: [{ value: this.detailsSaved?this.AssetDetailsList[i].requestedEmiCycle:'', disabled: false }],
                    purchasePrice: [{ value:  this.AssetDetailsList[i].purchasePrice, disabled: true }],
                    usageOfProposedVehicle: [this.detailsSaved?this.AssetDetailsList[i].usageOfProposedVehicle:''],
                    refinance: [this.detailsSaved?this.AssetDetailsList[i].refinance:''],
                    vehiclePurchasedFrom: [this.detailsSaved?this.AssetDetailsList[i].vehiclePurchasedFrom:''],
                    otherAssetsOwned: [{ value: this.AssetDetailsList[i].otherAssetsOwned, disabled: true }],
                    anyOtherLoans: [this.detailsSaved?(this.AssetDetailsList[i].anyOtherLoans)?this.selectAnyOtherLoan(this.AssetDetailsList[i].anyOtherLoans,false):'':''],
                    spokenTo: [this.detailsSaved?this.AssetDetailsList[i].spokenTo:'',[Validators.required]],
                    relationWithApplicant: [this.detailsSaved?this.AssetDetailsList[i].relationWithApplicant:''],
                    //options
                    assetCostVerified: [this.detailsSaved?this.AssetDetailsList[i].assetCostVerified:'',[Validators.required]],
                    requestedLoanAmountVerified: [this.detailsSaved?this.AssetDetailsList[i].requestedLoanAmountVerified:'',[Validators.required]],
                    tenureMonthsVerified: [this.detailsSaved?this.AssetDetailsList[i].tenureMonthsVerified:'',[Validators.required]],
                    vehicleTypeCodeVerified: [this.detailsSaved?this.AssetDetailsList[i].vehicleTypeCodeVerified:'',[Validators.required]],
                    vehicleMfrCodeVerified: [this.detailsSaved?this.AssetDetailsList[i].vehicleMfrCodeVerified:'',[Validators.required]],
                    vehicleModelVerified: [this.detailsSaved?this.AssetDetailsList[i].vehicleModelVerified:'',[Validators.required]],
                    requestedEmiVerified: [this.detailsSaved?this.AssetDetailsList[i].requestedEmiVerified:''],
                    purchasePriceVerified: [this.detailsSaved?this.AssetDetailsList[i].purchasePriceVerified:'',[Validators.required]],
                    otherAssetsOwnedVerified: [this.detailsSaved?this.AssetDetailsList[i].otherAssetsOwnedVerified:'',[Validators.required]],
                    anyOtherLoansVerified: [this.detailsSaved?this.AssetDetailsList[i].anyOtherLoansVerified:''],
                    spokenToVerified: [this.detailsSaved?this.AssetDetailsList[i].spokenToVerified:'',[Validators.required]],
                    relationWithApplicantVerified: [this.detailsSaved?this.AssetDetailsList[i].relationWithApplicantVerified:''],//cm
                  }));
            }
          }

          if (this.tvrCoApplicants.length < this.CoApplicantDetails.length) { //cm
            for (let i = this.tvrCoApplicants.length; i < this.CoApplicantDetails.length; i++) {
                this.tvrCoApplicants.push(
                  this.fb.group({
                    applicantID:[{ value: this.CoApplicantDetails[i].applicantID, disabled: true }],
                    applicantName: [{ value: this.CoApplicantDetails[i].applicantName, disabled: true }],
                    relationshipWithApplicant: [{ value: this.CoApplicantDetails[i].relationShipWithApplicant, disabled: true }],
                    mobileNo: [{ value: this.CoApplicantDetails[i].coAppMobileNo, disabled: true }],
                    //options                                                      
                    applicantNameVerified: [this.detailsSaved?this.CoApplicantDetails[i].applicantNameVerified:'',[Validators.required]],
                    relationshipWithApplicantVerified: [this.detailsSaved?this.CoApplicantDetails[i].relationshipWithApplicantVerified:'',[Validators.required]],
                    mobileNoVerified: [this.detailsSaved?this.CoApplicantDetails[i].mobileNoVerified:'',[Validators.required]],
                    applicantSignedDocs: [this.detailsSaved?this.CoApplicantDetails[i].applicantSignedDocs:'',[Validators.required]],
                    stayedWithApplicant: [this.detailsSaved?this.CoApplicantDetails[i].stayedWithApplicant:'',[Validators.required]],
                  }));

            }
          }

          if (this.tvrGurantors.length < this.GuarantorDetails.length) {  //cm
            for (let i = this.tvrGurantors.length; i < this.GuarantorDetails.length; i++) {
                this.tvrGurantors.push(
                  this.fb.group({
                    applicantID:[{value:''}],
                    applicantName: [{ value: this.GuarantorDetails[i].applicantName, disabled: true }],
                    mobileNo: [{ value: this.GuarantorDetails[i].gurantorMobileNo, disabled: true }],
                    relationWithApp: [{ value: this.GuarantorDetails[i].relationWithApp, disabled: true }], 
                    existingCustomer: [{ value: this.GuarantorDetails[i].existingCustomer}],
                    existingRelationshipAnyOther: [{ value: this.GuarantorDetails[i].existingRelationShip}],
                    //options
                    applicantNameVerified: [this.detailsSaved?this.GuarantorDetails[i].applicantNameVerified:'',[Validators.required]],
                    mobileNoVerified: [this.detailsSaved?this.GuarantorDetails[i].mobileNoVerified:'',[Validators.required]],
                    relationWithAppVerified: [this.detailsSaved?this.GuarantorDetails[i].relationWithAppVerified:'',[Validators.required]], 
                    applicantSignedDocs:[this.detailsSaved?this.GuarantorDetails[i].applicantSignedDocs:'',[Validators.required]],
                    vehicleMaintainedByCustomer:[this.detailsSaved?this.GuarantorDetails[i].vehicleMaintainedByCustomer:'',[Validators.required]],
                    existingCustomerVerified: [this.detailsSaved?this.GuarantorDetails[i].existingCustomerVerified:''],
                    existingRelationshipAnyOtherVerified: [this.detailsSaved?this.GuarantorDetails[i].existingRelationshipAnyOtherVerified:''],
                  }));

            }
          }
      
          
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
  selectAnyOtherLoan(arr,flag){
    let value: any;
    if(flag){
      value=arr.toString();
    }else{
      value = arr.split(',');
    }
    return value;    
  }

  spokenToCall(value,i){
    if(this.SpokenToLOV){
      for (let x = 0; x < this.SpokenToLOV.length; x++) {
        if(value == this.SpokenToLOV[x].key){
          this.tvrForm['controls']['assetDetails']['controls'][i]['controls']['relationWithApplicant'].setValue(this.SpokenToLOV[x].relation)
          break;
        }  
      }
    }else{
      this.toasterService.showError('Spoken To LOV not available', '');
    }
  }
  onSubmit() {
    this.isDirty = true;
    //this.onformsubmit = true;
   
    
    const formData = this.tvrForm.getRawValue();

    console.log(saveAssetDetailsList)
    if (this.tvrForm.valid === true) { 
    let TVRMainDetails = {};
    var saveAssetDetailsList=[];
    var saveCoApplicantDetailsList=[];
    var saveGuarantorDetailsList=[];

    TVRMainDetails = {
      applicationNumber:formData['applicationNumber'],
      entityTypeDesc:formData['entityTypeDesc'],
      entityType:formData['entityType'],
      customerName:formData['customerName'],
      mobileNumber:formData['mobileNumber'],
      dob:formData['dob'],
      soEmpIdName:formData['soEmpIdName'],
      sourcingTypeDesc:formData['sourcingTypeDesc'],
      sourcingType:formData['sourcingType'],
      productCategory:formData['productCategory'],
      productName:formData['productName'],
      productID:formData['productID'],
      landHoldingDetails:formData['landHoldingDetails'],
      marginMoney:formData['marginMoney'],
      dealerName:formData['dealerName'],
      discountOfferByDealer:formData['discountOfferByDealer'],
     
      application_numberVerified:formData['application_numberVerified'],
      entityTypeVerified:formData['entityTypeVerified'],
      applicantNameVerified:formData['applicantNameVerified'],
      mobileNumberVerified:formData['mobileNumberVerified'],
      dobVerified:formData['dobVerified'],
      soEmpIdNameVerified:formData['soEmpIdNameVerified'],
      sourcingTypeVerified:formData['sourcingTypeVerified'],
      productCategoryVerified:formData['productCategoryVerified'],
      productIdVerified:formData['productIdVerified'],
      landHoldingDetailsVerified:formData['landHoldingDetailsVerified'],
      marginMoneyVerified:formData['marginMoneyVerified'],
      dealerNameVerified:formData['dealerNameVerified'],
          
      currentAddress:formData['currentAddress'],
      currentAddLandline:formData['currentAddLandline'],
      permanentAddress:formData['permanentAddress'],
      permanentAddLandline:formData['permanentAddLandline'],
      currentAddressVerified:formData['currentAddressVerified'],
      currentAddLandlineVerified:formData['currentAddLandlineVerified'],
      permanentAddressVerified:formData['permanentAddressVerified'],
      permanentAddLandlineVerified:formData['permanentAddLandlineVerified'],
         
      isOfcAddApplicable:formData['isOfcAddApplicable'],
      officeAddress:formData['officeAddress'],
      officeAddLandline:formData['officeAddLandline'],
      alternateContactNumber:formData['alternateContactNumber'],
      designDesc:formData['designDesc'],
      designation:formData['designation'],
      natureOfBusiness:formData['natureOfBusiness'],
      noOfWorkingEmployees:formData['noOfWorkingEmployees'],
     
      //isOfcAddApplicableVerified:formData['isOfcAddApplicableVerified'],
      officeAddressVerified:formData['officeAddressVerified'],
      officeAddLandlineVerified:formData['officeAddLandlineVerified'],
      alternateContactNumberVerified:formData['alternateContactNumberVerified'],
      designationVerified:formData['designationVerified'],
      natureOfBusinessVerified:formData['natureOfBusinessVerified'],
      noOfWorkingEmployeesVerified:formData['noOfWorkingEmployeesVerified'],

      monthlyIncomeAmount:formData['monthlyIncomeAmount'],
      employerName:formData['employerName'],
      employerType:formData['employerType'],
      customerProfileMatching:formData['customerProfileMatching'],
      houseOwnership:formData['houseOwnership'],
      residenceDesc:formData['residenceDesc'],
      residentStatus:formData['residentStatus'],
      monthlyIncomeAmountVerified:formData['monthlyIncomeAmountVerified'],
     // employerNameVerified:formData['employerNameVerified'],
     // employerTypeVerified:formData['employerTypeVerified'],
      houseOwnershipVerified:formData['houseOwnershipVerified'],
      residentStatusVerified:formData['residentStatusVerified'],
     
      remarks:formData['remarks'],
      tvrDoneDate:formData['tvrDoneDate'],
      tvrDoneByName:formData['tvrDoneByName'],
      tvrDoneEmpID:formData['tvrDoneEmpID'],
      tvrID:formData['tvrID'],    

      referenceAddress1:formData['referenceAddress1'],
      referenceAddress2:formData['referenceAddress2'],
      referenceContactNo1:formData['referenceContactNo1'],
      referenceContactNo2:formData['referenceContactNo2'],
      referenceName1:formData['referenceName1'],
      referenceName2:formData['referenceName2'],

      referenceStatus1:formData['referenceStatus1'],
      referenceStatus2:formData['referenceStatus2'],        
}

     formData.assetDetails.forEach((obj) => {           
      let assetDetailsObj  = {
                    assetCost: obj.assetCost,
                    collateralID:obj.collateralID,
                    requestedLoanAmount: obj.requestedLoanAmount,
                    tenureMonths: obj.tenureMonths,
                    vehicleTypeCode: obj.vehicleTypeCode,
                    vehicleMfrCode: obj.vehicleMfrCode,
                    vehicleModel: obj.vehicleModel,
                    requestedEmi: obj.requestedEmi,
                    requestedEmiCycle: obj.requestedEmiCycle,
                    purchasePrice: obj.purchasePrice,
                    usageOfProposedVehicle: obj.usageOfProposedVehicle,
                    refinance: obj.refinance,
                    vehiclePurchasedFrom: obj.vehiclePurchasedFrom,
                    otherAssetsOwned: obj.otherAssetsOwned,
                    anyOtherLoans: this.selectAnyOtherLoan(obj.anyOtherLoans,true),
                    spokenTo: obj.spokenTo,
                    relationWithApplicant: obj.relationWithApplicant,
                    //options
                    assetCostVerified: obj.assetCostVerified,
                    requestedLoanAmountVerified: obj.requestedLoanAmountVerified,
                    tenureMonthsVerified: obj.tenureMonthsVerified,
                    vehicleTypeCodeVerified: obj.vehicleTypeCodeVerified,
                    vehicleMfrCodeVerified: obj.vehicleMfrCodeVerified,
                    vehicleModelVerified: obj.vehicleModelVerified,
                    requestedEmiVerified: obj.requestedEmiVerified,
                    purchasePriceVerified: obj.purchasePriceVerified,
                    otherAssetsOwnedVerified: obj.otherAssetsOwnedVerified,
                    anyOtherLoansVerified: obj.anyOtherLoansVerified,
                    spokenToVerified: obj.spokenToVerified,
                    relationWithApplicantVerified: obj.relationWithApplicantVerified,
      }     
        saveAssetDetailsList.push(assetDetailsObj)      
    });

    formData.coAppDetails.forEach((obj, index) => {           
        let coAppObj  = {
          applicantID:obj.applicantID,
          applicantName: obj.applicantName,
          relationshipWithApplicant: obj.relationshipWithApplicant,
          mobileNo:obj.mobileNo,
          applicantNameVerified:obj.applicantNameVerified,
          relationshipWithApplicantVerified:obj.relationshipWithApplicantVerified,
          mobileNoVerified:obj.mobileNoVerified,
          applicantSignedDocs:obj.applicantSignedDocs,
          stayedWithApplicant:obj.stayedWithApplicant,
                      
        }     
        saveCoApplicantDetailsList.push(coAppObj)      
      });

      formData.gurantorDetails.forEach((obj, index) => {           
        let gurantorObj  = {
            applicantID:obj.applicantID,
            applicantName:obj.applicantName,
            mobileNo:obj.mobileNo,
            relationWithApp:obj.relationWithApp,
            existingCustomer:obj.existingCustomer,
            existingRelationshipAnyOther:obj.existingRelationshipAnyOther,
            applicantNameVerified:obj.applicantNameVerified,
            mobileNoVerified:obj.mobileNoVerified,
            relationWithAppVerified:obj.relationWithAppVerified,
            applicantSignedDocs:obj.applicantSignedDocs,
            vehicleMaintainedByCustomer:obj.existingCustomerVerified,
            existingCustomerVerified:obj.existingCustomerVerified,
            existingRelationshipAnyOtherVerified:obj.existingRelationshipAnyOtherVerified,
                      
        }     
        saveGuarantorDetailsList.push(gurantorObj)      
      });

      console.log(TVRMainDetails);
      console.log(saveAssetDetailsList);
      console.log(saveCoApplicantDetailsList);
      console.log(saveGuarantorDetailsList);
    const tvrDetails = {
      "LeadID": this.leadId,
    //"AssetDetails": JSON.stringify(saveAssetDetailsList),
      "TVRMainDetails":TVRMainDetails,
      "AssetDetails":saveAssetDetailsList,
      "CoApplicantDetails":saveCoApplicantDetailsList,
      "GuarantorDetails":saveGuarantorDetailsList
    }
   

    this.tvrService
      .saveNewTvrDetails(tvrDetails
      )
      .subscribe((res: any) => {
        if (res.Error == 0 && (!res.ProcessVariables.error || res.ProcessVariables.error.code == 0)) {
          this.toasterService.showSuccess(res.ProcessVariables.error.message, '');
          this.getTvrDetails()
        }
        else if (res.ProcessVariables.error || res.ProcessVariables.error.code == 1) {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
  }
  else {
      this.toasterService.showError(
        'Please fill all mandatory fields.','');
    }
}
  //new code revamp ends

}
