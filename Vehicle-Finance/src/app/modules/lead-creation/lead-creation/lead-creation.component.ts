import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

import { CreateLeadService } from '../service/creatLead.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToastrService } from 'ngx-toastr';
// import Qde from '@model/lead.model';
@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css'],
})
export class LeadCreationComponent implements OnInit {
  // qde: Qde;
  createLeadForm: FormGroup;
  lovLabels: any = [];
  labels: any = {};
  keyword: any;
  leadId: number;

  applicantType: string;
  sourcingChange: any;
  sourcingCodePlaceholder = 'Sourcing Code';
  sourchingTypeData = [];
  sourchingTypeValues = [];
  text: string;
  loanAccountBranch: string;
  leadHandeledBy: string;
  spokesCodeLocation: any = [];
  isSpoke: number;
  businessDivision: any = [];
  isBusinessDivisionEnable: boolean;
  bizDivId: string;
  branchId: number;
  userId: number;

  LOV: any = [];

  productCategoryData;
  productData = [];
  sourchingType: string;
  productCategorySelectedList = [];
  productCategoryList = [];
  sourcingChannelData = [];
  sourcingData = [];
  socuringTypeData = [];
  placeholder = [];
  sourcingCodeData: Array<{ key: string; value: string }> = [];
  dealerCodeData: Array<any> = [];
  fundingProgramData = [];
  isSourcingType: boolean;
  showModal: boolean;
  modalMessage: string;
  isNgAutoCompleteSourcing: any;
  isNgAutoCompleteDealer: any;
  isMobile: any;
  isSourchingCode: boolean;
  isDirty: boolean;
  nameFirstErrorMessage: string;
  nameLastErrorMessage: string;
  firstPlaceholder: string;
  secondPlaceholder: string;
  thirdPlaceholder: string;
  dobOrDoiPlaceHolder: string;
  isFirstNameRequired: boolean;
  isLastNameRequired: boolean;
  dob: any;


  obj = {};
  test = [];

  public maxAge: Date = new Date();
  public minAge: Date = new Date();

  namePattern: string;
  nameLength: number;
  mobileLength: number;
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';

  loanLeadDetails: {
    bizDivision: string;
    product: string;
    priority: string;
    fundingProgram: string;
    sourcingChannel: string;
    sourcingType: string;
    sourcingCode: string;
    dealorCode: string;
    spokeCode: number;
    loanBranch: number;
    leadHandeledBy: number;
    sourcingCodeDescription: string;
  };

  applicantDetails: {
    entity: string;
    nameOne: string;
    nameTwo: string;
    nameThree: string;
    mobileNumber: string;
    dobOrDoc: string;
  };

  constructor(
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService,
    private createLeadService: CreateLeadService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private utilityService: UtilityService,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    this.onChangeLanguage('English');
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getUserDetailsData();
    this.getSourcingChannel();
    this.createLeadForm.patchValue({ entity: 'INDIVENTTYP' });
    this.selectApplicantType('INDIVENTTYP', true);
    this.minAge.setFullYear(this.minAge.getFullYear() - 100);
    this.maxAge.setFullYear(this.maxAge.getFullYear() - 10);
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = this.labels.validationData.name.maxLength;
        this.mobileLength = this.labels.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );
  }

  initForm() {
    this.createLeadForm = new FormGroup({
      bizDivision: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      fundingProgram: new FormControl('', Validators.required),
      priority: new FormControl(''),
      sourcingChannel: new FormControl('', Validators.required),
      sourcingType: new FormControl('', Validators.required),
      sourcingCode: new FormControl(''),
      dealerCode: new FormControl('', Validators.required),
      rcLimit: new FormControl({ value: '', disabled: true }, Validators.required),
      rcUtilizedLimit: new FormControl({ value: '', disabled: true }, Validators.required),
      rcUnutilizedLimit: new FormControl({ value: '', disabled: true }, Validators.required),
      spokeCodeLocation: new FormControl({
        value: '',
        disabled: !this.isSpoke,
      }),
      loanBranch: new FormControl(
        { value: this.loanAccountBranch, disabled: true },
        Validators.required
      ),
      leadHandeledBy: new FormControl({
        value: this.leadHandeledBy,
        disabled: true,
      }),
      entity: new FormControl('', Validators.required),
      nameOne: new FormControl('', Validators.required),
      nameTwo: new FormControl(''),
      nameThree: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
    });
  }

  getLOV() {
    this.commonLovService
      .getLovData()
      .subscribe((lov: any) => (this.LOV = lov));
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    console.log(roleAndUserDetails, 'Test')
    this.getBusinessDivision(roleAndUserDetails);

    this.branchId = roleAndUserDetails.userDetails.branchId;
    const branchName = roleAndUserDetails.userDetails.branchName;
    this.loanAccountBranch = `${this.branchId}-${branchName}`;

    this.userId = roleAndUserDetails.userDetails.userId;
    const userName = roleAndUserDetails.userDetails.firstName;
    this.leadHandeledBy = `${this.userId}-${userName}`;

    this.isSpoke = roleAndUserDetails.userDetails.isSpokes;
    this.spokesCodeLocation = this.isSpoke
      ? roleAndUserDetails.userDetails.parentBranch
      : null;
    this.createLeadForm.patchValue({
      loanBranch: this.loanAccountBranch,
      leadHandeledBy: this.leadHandeledBy,
      // spokeCodeLocation:  this.spokesCodeLocation   
    });
  }

  getBusinessDivision(roleAndUserDetails) {
    const businessDivision = roleAndUserDetails.businessDivisionList;
    this.bizDivId = businessDivision[0].bizDivId;
    const lov = this.LOV.LOVS.businessDivision;
    lov.map((data) => {
      businessDivision.map((ele) => {
        if (ele.bizDivId === data.key) {
          const val = {
            key: ele.bizDivId,
            value: data.value,
          };
          this.businessDivision.push(val);
        }
      });
    });

    if (this.businessDivision.length === 1) {
      this.createLeadForm.patchValue({ bizDivision: this.bizDivId });
      this.isBusinessDivisionEnable = true;
      this.getProductCategory(this.bizDivId);
    } else {
      this.isBusinessDivisionEnable = false;
    }
  }

  getProductCategory(event) {
    this.bizDivId = this.isBusinessDivisionEnable ? event : event.target.value;
    this.createLeadService
      .getProductCategory(this.bizDivId)
      .subscribe((res: any) => {
        this.productCategoryList = res.ProcessVariables.productCategoryDetails;
        this.productCategoryData = this.utilityService.getValueFromJSON(
          this.productCategoryList,
          'productCatCode',
          'prodcutCatName'
        );
      });
  }

  productCategoryChange(event) {
    this.productCategorySelectedList = [];
    console.log('productCategoryChange', event.target.value);
    const productCategorySelected = event.target.value;
    this.productCategorySelectedList = this.utilityService.getValueFromJSON(
      this.productCategoryList.filter(
        (data) => data.productCatCode === productCategorySelected
      ),
      'assetProdcutCode',
      'assetProdutName'
    );
    this.createLeadForm.patchValue({ product: '' });
  }

  productChange(event) {
    this.fundingProgramData = [];
    console.log('productChange', event.target.value);
    const productChange = event.target.value;
    this.createLeadService
      .fundingPrograming(productChange)
      .subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;

        if (appiyoError === '0' && apiError === '0') {
          const data = response.ProcessVariables.fpList;
          if (data) {
            data.map((ele) => {
              const datas = {
                key: ele.fpId,
                value: ele.fpDescription,
              };
              this.fundingProgramData.push(datas);
            });
          }
        }
      });
    this.createLeadForm.patchValue({ fundingProgram: '' });
  }

  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      this.sourcingData = response;
      this.sourcingChannelData = this.utilityService.getValueFromJSON(
        this.sourcingData,
        'sourcingChannelId',
        'sourcingChannelDesc'
      );
    });
  }

  sourcingChannelChange(event: any) {
    this.sourchingTypeValues = [];
    this.sourcingChange = event.target.value;

    this.sourchingTypeValues = this.utilityService.getValueFromJSON(
      this.sourcingData.filter(
        (data) => data.sourcingChannelId === this.sourcingChange
      ),
      'sourcingTypeId',
      'sourcingTypeDesc'
    );
    // this.createLeadForm.patchValue({ sourcingType: '' });
    if (this.sourchingTypeValues.length === 1) {
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.createLeadForm.patchValue({ sourcingType: sourcingTypeData });
      if (sourcingTypeData === '11SOURTYP') {
        this.isSourchingCode = true;
        this.sourcingCodePlaceholder = 'Not Applicable';
      } else {
        this.isSourchingCode = false;
        this.sourcingCodePlaceholder = 'Sourcing Code';
      }
      this.sourchingTypeChange(sourcingTypeData);
    } else {
      this.sourcingCodePlaceholder = 'Sourcing Code';
      this.createLeadForm.patchValue({ sourcingType: '' });
    }
  }

  sourchingTypeChange(event) {
    const sourchingTypeId = event.target ? event.target.value : event;
    this.socuringTypeData = this.sourcingData.filter(
      (data) => data.sourcingTypeId === sourchingTypeId
    );
    this.placeholder = this.utilityService.getValueFromJSON(
      this.socuringTypeData,
      'sourcingCodeType',
      'sourcingCode'
    );
    console.log('placeholder', this.placeholder);
    this.createLeadForm.controls.sourcingCode.reset();
    this.sourcingCodePlaceholder = this.placeholder[0].value;
    if (this.sourcingCodePlaceholder === 'Not Applicable') {
      this.isSourchingCode = true;
    } else {
      this.isSourchingCode = false;
    }
  }

  onSourcingCodeSearch(event) {
    let inputString = event;
    let sourcingCode = [];
    console.log('inputStringSorc', event);
    sourcingCode = this.socuringTypeData.filter(
      (data) => data.sourcingCodeType === this.placeholder[0].key
    );
    console.log('sourcingCode', sourcingCode);
    if (sourcingCode.length === 0) {
      return;
    }
    let sourcingCodeType: string = sourcingCode[0].sourcingCodeType;
    let sourcingSubCodeType: string = sourcingCode[0].sourcingSubCodeType;
    this.createLeadService
      .sourcingCode(sourcingCodeType, sourcingSubCodeType, inputString)
      .subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        if (appiyoError === '0' && apiError === '0') {
          this.sourcingCodeData = response.ProcessVariables.codeList;
          this.keyword = 'value';
        }
      });
  }

  onDealerCodeSearch(event) {
    let inputString = event;
    console.log('inputStringDelr', event);
    this.createLeadService.dealerCode(inputString).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.dealerCodeData = response.ProcessVariables.dealorDetails;
        this.keyword = 'dealorName';
        console.log('this.dealerCodeData', this.dealerCodeData);
      }
    });
  }

  selectDealerEvent(event) {
    this.isNgAutoCompleteDealer = event ? true : false;
    const rcData = event;
    this.createLeadForm.patchValue({ rcLimit: rcData.rcLimit });
    this.createLeadForm.patchValue({ rcUtilizedLimit: rcData.rcUtilized });
    this.createLeadForm.patchValue({ rcUnutilizedLimit: rcData.rcUnutilized });
  }

  onFocused($event) { }

  selectApplicantType(event: any, bool) {
    this.applicantType = bool ? event : event.target.value;
    console.log('applicantType', this.applicantType);
    (this.applicantType === 'INDIVENTTYP') ? this.onIndividual() : this.onNonIndividual();
    setTimeout(() => {
      const nameOne = this.createLeadForm.controls['nameOne'].value;
      this.createLeadForm.controls['nameOne'].setValue(nameOne || '');
      const nameThree = this.createLeadForm.controls['nameThree'].value;
      this.createLeadForm.controls['nameThree'].setValue(nameThree || '');
    });
  }

  onIndividual() {
    this.createLeadForm.controls['nameThree'].setValidators(Validators.required);
    this.createLeadForm.controls['nameThree'].updateValueAndValidity();
    this.namePattern = 'alpha';
    this.nameFirstErrorMessage = 'First Name is mandatory';
    this.nameLastErrorMessage = 'Last Name is mandatory';
    this.firstPlaceholder = 'First Name';
    this.secondPlaceholder = 'Middle Name';
    this.thirdPlaceholder = 'Last Name';
    this.dobOrDoiPlaceHolder = 'Date of birth';
    this.isFirstNameRequired = true;
    this.isLastNameRequired = true;
  }

  onNonIndividual() {
    this.createLeadForm.controls['nameThree'].setValidators([]);
    this.createLeadForm.controls['nameThree'].updateValueAndValidity();
    this.namePattern = 'text';
    this.nameFirstErrorMessage = 'Company Name 1 is mandatory';
    this.nameLastErrorMessage = '';
    this.firstPlaceholder = 'Company Name 1';
    this.secondPlaceholder = 'Company Name 2';
    this.thirdPlaceholder = 'Company Name 3';
    this.dobOrDoiPlaceHolder = 'Date of Incorporation';
    this.isFirstNameRequired = false;
    this.isLastNameRequired = false;
  }

  onChangeLanguage(labels: string) {
    if (labels === 'Hindi') {
      this.labelsData.getLanguageLabelData().subscribe((data) => {
        this.labels = data[0];
      });
    } else {
      this.labelsData.getLabelsData().subscribe((data) => {
        this.labels = data;
      });
    }
  }

  onFirstName(event) {
    this.firstName = event.target.value;
  }

  onMiddleName(event) {
    this.middleName = event.target.value;
  }

  onLastName(event) {
    this.lastName = event.target.value;
  }

  onSubmit() {
    const formValue = this.createLeadForm.getRawValue();
    console.log('this.createLeadForm.valid', this.createLeadForm.valid);
    console.log('isNgAutoCompleteDealer', this.createLeadForm.controls.dealerCode.value);
    console.log('isNgAutoCompleteSourcing', this.createLeadForm.controls.sourcingCode.value);

    this.isNgAutoCompleteSourcing = this.createLeadForm.controls.sourcingCode.value;
    this.isNgAutoCompleteDealer = this.createLeadForm.controls.dealerCode.value;
    this.isMobile = this.createLeadForm.controls.mobile.value;
    this.isDirty = true;

    if (
      this.createLeadForm.valid === true &&
      this.isNgAutoCompleteDealer !== '' &&
      this.isNgAutoCompleteSourcing !== '' &&
      this.isMobile !== ''
    ) {
      const leadModel: any = { ...formValue };
      this.leadStoreService.setLeadCreation(leadModel);

      this.loanLeadDetails = {
        bizDivision: leadModel.bizDivision,
        product: leadModel.product,
        priority: leadModel.priority,
        fundingProgram: leadModel.fundingProgram,
        sourcingChannel: leadModel.sourcingChannel,
        sourcingType: leadModel.sourcingType,
        sourcingCode: leadModel.sourcingCode
          ? leadModel.sourcingCode.key
          : '',
        dealorCode: leadModel.dealerCode.dealorCode,
        // spokeCode: Number(leadModel.spokeCode),
        spokeCode: 1,
        loanBranch: Number(this.branchId),
        leadHandeledBy: Number(this.userId),
        sourcingCodeDescription: leadModel.sourcingCode ? leadModel.sourcingCode.value : ''
      };

      this.applicantDetails = {
        entity: leadModel.entity,
        nameOne: leadModel.nameOne,
        nameTwo: leadModel.nameTwo ? leadModel.nameTwo : null,
        nameThree: leadModel.nameThree,
        mobileNumber: `91${leadModel.mobile}`,
        dobOrDoc: this.utilityService.getDateFormat(leadModel.dateOfBirth),
      };

      this.createLeadService
        .createLead(this.loanLeadDetails, this.applicantDetails, false)
        .subscribe(
          (res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;

            if (appiyoError === '0' && apiError === '0') {
              this.createLeadDataService.setLeadData(
                this.loanLeadDetails,
                this.applicantDetails
              );

              const message = response.ProcessVariables.error.message;
              const isDedupeAvailable =
                response.ProcessVariables.isDedupeAvailable;
              const leadSectionData = response.ProcessVariables;
              this.leadId = leadSectionData.leadId;

              if (isDedupeAvailable) {
                const leadDedupeData =
                  response.ProcessVariables;
                this.leadStoreService.setDedupeData(leadDedupeData);
                this.router.navigateByUrl('pages/lead-creation/lead-dedupe');
                return;
              }

              this.createLeadService
                .getLeadById(this.leadId)
                .subscribe((res: any) => {
                  const response = res;
                  const appiyoError = response.Error;
                  const apiError = response.ProcessVariables.error.code;
                  const leadSectionData = response.ProcessVariables;

                  if (appiyoError === '0' && apiError === '0') {
                    this.leadId = leadSectionData.leadId;
                    this.createLeadDataService.setLeadSectionData(
                      leadSectionData
                    );
                    this.showModal = true;
                  } else {
                    const message = response.ProcessVariables.error.message;
                    this.toasterService.error(message, 'Lead Creation');
                  }
                });
            } else {
              const message = response.ProcessVariables.error.message;
              this.toasterService.error(message, 'Lead Creation');
            }
          },
          (err) => {
            alert(err);
          }
        );
    } else {
      this.toasterService.error(
        'Please fill all mandatory fields.',
        'Lead Creation'
      );
    }
  }

  navgiateToNextPage() {
    this.router.navigateByUrl(`pages/lead-section/${this.leadId}`);
  }
}
