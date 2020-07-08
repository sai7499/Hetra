import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';

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
  submitted = null ;
  totalOdAmount = 0;
  constructor(private labelService: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private toasterService: ToasterService


  ) {
    this.odDetailsListArray = this.formBuilder.array([])
    this.loanEnquiryInThirtyDaysArray = this.formBuilder.array([])
    this.loanEnquiryInSixtyDaysArray = this.formBuilder.array([])
  }

  ngOnInit() {
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.odDetailsForm = this.formBuilder.group({
      odDetailsList: this.odDetailsListArray,
      loanEnquiryInThirtyDays: this.loanEnquiryInThirtyDaysArray,
      loanEnquiryInSixtyDays: this.loanEnquiryInSixtyDaysArray,
      highestDpdInLastSixMonths: [""],
      highestDpdInLastTwelveMonths : [""],
      writtenOffLoans: [""],
      writtenOffLoansWithSuiteFiled: [""],
      lossLoans: [""],
      settledLoans: [""],
      proofCollected: [""],
      clearenceProof: [""],
      cibilJustification:[null, Validators.compose([Validators.required, Validators.maxLength(200),Validators.pattern(/[^@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\? ]/g )])]
    });
    this.getLov();
  }
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log(value)
    });
  }
  onSelectLoan(event){
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
      member: [""],
      enquiryDate: [""],
      typeOfLoan: [""],
      enquiryAmount: [""],
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
      member: [""],
      enquiryDate: [""],
      typeOfLoan: [""],
      enquiryAmount: [""],
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

  onSubmit() {
    this.submitted = false;
    // stop here if form is invalid
    if (this.odDetailsForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'Cibil OD Details'
      );
      return;
    }else{
    this.submitted = true;

      this.toasterService.showSuccess(
        'Saved Successfully',
        'Cibil OD Details'
      );
    }
}
}
