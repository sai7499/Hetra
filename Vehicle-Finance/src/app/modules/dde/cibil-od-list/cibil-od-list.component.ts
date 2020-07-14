import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';
import { OdDetailsService } from '@services/od-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';

@Component({
  selector: 'app-cibil-od-list',
  templateUrl: './cibil-od-list.component.html',
  styleUrls: ['./cibil-od-list.component.css']
})
export class CibilOdListComponent implements OnInit {
  labels: any;
  odDetailsForm: FormGroup;
  odDetailsList: FormGroup;
  loanEnquiryInThirtyDays: FormGroup;
  loanEnquiryInSixtyDays: FormGroup;
  odDetailsListArray: FormArray;
  loanEnquiryInThirtyDaysArray: FormArray;
  loanEnquiryInSixtyDaysArray: FormArray;
  odTypeValues = ["Individual", "Joint", "Guarentor"]
  loanTypes = ["Business Loan", "Two Wheeler Loan", "Over Draft", "Mathura Loan", "Agri Loan", "Gold Loan", "Home Loan", "Others"]
  proofs = ["NA", "SUB", "DBT", "LSS"]
  selctedLoan: any;
  submitted = null;
  totalOdAmount = 0;
  leadId: number;
  userId: string;
  odListLov: any = [];
  applicantId: number;
  odApplicantList: any;
  constructor(private labelService: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private toasterService: ToasterService,
    private odDetailsService: OdDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantDataService: ApplicantDataStoreService,




  ) {
    this.odDetailsListArray = this.formBuilder.array([])
    this.loanEnquiryInThirtyDaysArray = this.formBuilder.array([])
    this.loanEnquiryInSixtyDaysArray = this.formBuilder.array([])
  }

  ngOnInit() {
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.getLeadId();
    this.userId = localStorage.getItem('userId');

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log('applicant id -->',this.applicantId);
      
      this.applicantDataService.setApplicantId(this.applicantId);
    });

    this.odDetailsForm = this.formBuilder.group({
      odDetailsList: this.odDetailsListArray,
      loanEnquiryInThirtyDays: this.loanEnquiryInThirtyDaysArray,
      loanEnquiryInSixtyDays: this.loanEnquiryInSixtyDaysArray,
      totalAmount:[""],
      highDpd6m: [""],
      highDpd12m: [""],
      writtenOffLoans: [""],
      writtenOffLoansWithSuite: [""],
      lossLoans: [""],
      settledLoans: [""],
      clearanceProofCollected: [""],
      clearenceProof: [""],
      justification: [null, Validators.compose([Validators.required, Validators.maxLength(200), Validators.pattern(/[^@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\? ]/g)])]
    });
    this.getLov();
    this.getOdDetails();
  }
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log(value)
      this.odListLov.odApplicantType = value.LOVS.odApplicantType
      this.odListLov.typeOfLoan = value.LOVS.typeOfLoan
      this.odListLov.clearanceProof = value.LOVS.clearanceProof


    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }
  
  onSelectLoan(event) {
    console.log(event);
    this.selctedLoan = event
  }
  private getodListDetails() {

    return this.formBuilder.group({
      odType: [""],
      odAmount: [""],
      typeOfLoan: [""],
      otherTypeOfloan: [""],
      odDpd: [""],
    });


  }
  addOdDetails() {
    this.odDetailsListArray.push(this.getodListDetails());

  }
  removeOdDetails(i?: any) {
    if (this.odDetailsListArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      this.odDetailsListArray.removeAt(i);
    }


  }
  private getLoanEnquiryInThirtyDays() {
    return this.formBuilder.group({
      memberType: [""],
      enquiryDate: [""],
      typeOfLoan: [""],
      amount: [""],
    });
  }
  addLastThirtyDaysLoan() {
    this.loanEnquiryInThirtyDaysArray.push(this.getLoanEnquiryInThirtyDays());
  }
  removeLastThirtyDaysLoan(i?: any) {
    if (this.loanEnquiryInThirtyDaysArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      this.loanEnquiryInThirtyDaysArray.removeAt(i);
    }
  }
  private getLoanEnquiryInSixtyDays() {
    return this.formBuilder.group({
      memberType: [""],
      enquiryDate: [""],
      typeOfLoan: [""],
      amount: [""],
    });
  }
  addLastSixtyDaysLoan() {
    this.loanEnquiryInSixtyDaysArray.push(this.getLoanEnquiryInSixtyDays());
  }
  removeLastSixtyDaysLoan(i?: any) {
    if (this.loanEnquiryInSixtyDaysArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      this.loanEnquiryInSixtyDaysArray.removeAt(i);
    }
  }
  get f() { return this.odDetailsForm.controls; }
  getParentOdDetails(){
    const body = {
     leadId : this.leadId

    };
    this.odDetailsService.getOdApplicantList(body).subscribe((res: any) => {
        console.log('get od details by applicnat id........>',res)
        this.odApplicantList = res.ProcessVariables.applicantList
        console.log(this.odApplicantList);
        
      });
  }
  getOdDetails() {
    const body = {
      userId: this.userId,
      applicantId: this.applicantId,

    };
    this.odDetailsService.getOdDetails(body).subscribe((res: any) => {
        console.log(res)
      });
  }

  onSubmit() {
    this.submitted = false;
    console.log(this.odDetailsForm);
    
    // stop here if form is invalid
    if (this.odDetailsForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'Cibil OD Details'
      );
      return;
    } else {
      this.submitted = true;

      this.toasterService.showSuccess(
        'Saved Successfully',
        'Cibil OD Details'
      );
const body={
  userId: this.userId,
  applicantId: this.applicantId,
  assetAppOdDetails: {
    clearanceProof: this.odDetailsForm.controls.clearenceProof.value,
    clearanceProofCollected: this.odDetailsForm.controls.clearanceProofCollected.value,
    highDpd12m: this.odDetailsForm.controls.highDpd12m.value,
    highDpd6m: this.odDetailsForm.controls.highDpd6m.value,
    justification: this.odDetailsForm.controls.justification.value,
    lossLoans: this.odDetailsForm.controls.lossLoans.value,
   settledLoans: this.odDetailsForm.controls.settledLoans.value,
    writtenOffLoans: this.odDetailsForm.controls.writtenOffLoans.value,
   writtenOffLoansWithSuite: this.odDetailsForm.controls.writtenOffLoansWithSuite.value,
    totalAmount: this.odDetailsForm.controls.totalAmount.value,
  }
}
console.log(body)
      this.odDetailsService
        .saveParentOdDetails(this.odDetailsForm.value)
        .subscribe((res: any) => {
          console.log('post od details--->', res)
        });
    }
  }
  onOdAmount(event: any, i: number) {

    const odAmount = this.odDetailsListArray.value[i].odAmount;
    const totalOdAmount = odAmount;
    this.odDetailsListArray.at(i).patchValue({ totalOdAmount });
    if (this.odDetailsListArray && this.odDetailsListArray.length > 0) {
      this.totalOdAmount = 0;
      for (let i = 0; i < this.odDetailsListArray.length; i++) {
        this.totalOdAmount = Math.round(
          this.totalOdAmount + Number(this.odDetailsListArray.value[i].odAmount)
        );
      }
    }
  }
  onBackToApplicant() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/cibil-od`);
  }
}
