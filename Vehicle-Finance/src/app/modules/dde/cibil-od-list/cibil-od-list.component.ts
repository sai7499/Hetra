import { Component, OnInit } from "@angular/core";
import { LabelsService } from "@services/labels.service";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { CommomLovService } from "@services/commom-lov-service";
import { ToasterService } from "@services/toaster.service";
import { OdDetailsService } from "@services/od-details.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicantDataStoreService } from "@services/applicant-data-store.service";
import { UtilityService } from "@services/utility.service";
import { CibilOdService } from '../cibil-od/cibil-od.service';

@Component({
  selector: "app-cibil-od-list",
  templateUrl: "./cibil-od-list.component.html",
  styleUrls: ["./cibil-od-list.component.css"],
})
export class CibilOdListComponent implements OnInit {
  labels: any;
  odDetailsForm: any;
  odAccountDetails: FormGroup;
  loanEnquiryInThirtyDays: FormGroup;
  loanEnquiryInSixtyDays: FormGroup;
  odAccountDetailsArray: FormArray;
  loanEnquiryInThirtyDaysArray: FormArray;
  loanEnquiryInSixtyDaysArray: FormArray;
  odTypeValues = ["Individual", "Joint", "Guarentor"];
  loanTypes = [
    "Business Loan",
    "Two Wheeler Loan",
    "Over Draft",
    "Mathura Loan",
    "Agri Loan",
    "Gold Loan",
    "Home Loan",
    "Others",
  ];
  proofs = ["NA", "SUB", "DBT", "LSS"];
  selctedLoan: any;
  submitted = null;
  totalOdAmount = 0;
  leadId: number;
  userId: string;
  odListLov: any = [];
  applicantId: number;
  odApplicantList: any;
  thirtyDays: any = 1;
  sixtyDays: any = 0;
  public toDayDate: Date = new Date();
  odDetails: any;
  applicantType: any;

  constructor(
    private labelService: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private toasterService: ToasterService,
    private odDetailsService: OdDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantDataService: ApplicantDataStoreService,
    private utilityService: UtilityService,
    private cibilOdService: CibilOdService
  ) {
    this.odAccountDetailsArray = this.formBuilder.array([]);
    this.loanEnquiryInThirtyDaysArray = this.formBuilder.array([]);
    this.loanEnquiryInSixtyDaysArray = this.formBuilder.array([]);
  }

  async ngOnInit()  {
    // this.applicantType = "hai this.applicantType"
    this.labelService.getLabelsData().subscribe((res) => {
      this.labels = res;
    });
    this.getLeadId();
    this.userId = localStorage.getItem("userId");

   await this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log("applicant id -->", this.applicantId);

      this.applicantDataService.setApplicantId(this.applicantId);
      this.getApplicantData();

      console.log('this.odApplicantList-->',this.odApplicantList)
    });

    this.odDetailsForm = this.formBuilder.group({
      odAccountDetails: this.odAccountDetailsArray,
      loanEnquiryInThirtyDays: this.loanEnquiryInThirtyDaysArray,
      loanEnquiryInSixtyDays: this.loanEnquiryInSixtyDaysArray,
      totalAmount: [""],
      highDpd6m: [""],
      highDpd12m: [""],
      writtenOffLoans: [""],
      writtenOffLoansWithSuite: [""],
      lossLoans: [""],
      settledLoans: [""],
      clearanceProofCollected: [""],
      clearenceProof: [""],
      justification: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(
            /[^@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\? ]/g
          ),
        ]),
      ],
    });
    this.getLov();
    this.getOdDetails();
    this.odDetailsForm
      .get("loanEnquiryInThirtyDays")
      .valueChanges.subscribe((res: any) => {

        if ((res.value = !null)) {
          for (let i = 0; i < res.length; i++) {
            res[i].isSixtyDays = 0;
          }
        }
      });
    this.odDetailsForm
      .get("loanEnquiryInSixtyDays")
      .valueChanges.subscribe((res: any) => {
        if ((res.value = !null)) {
          for (let i = 0; i < res.length; i++) {
            res[i].isSixtyDays = 1;
          }
        }
      });
  }
  getApplicantData(){
    this.cibilOdService.$isApplicantList.subscribe((data) => {
      console.log("i got data", data)
      this.odApplicantList = data
      console.log(this.odApplicantList.applicantType)
      this.applicantType = this.odApplicantList.applicantType;
      

    })
  }
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log(value);
      this.odListLov.odApplicantType = value.LOVS.odApplicantType;
      this.odListLov.typeOfLoan = value.LOVS.typeOfLoan;
      this.odListLov.clearanceProof = value.LOVS.clearanceProof;
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
    this.selctedLoan = event;
  }
  private getodListDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        odType: [""],
        odAmount: [""],
        typeOfLoan: [""],
        otherTypeOfloan: [""],
        odDpd: [""],
      });
    } else {
      return this.formBuilder.group({
        id: [data.id ? data.id : null],
        odType: [data.odType ? data.odType : ""],
        odAmount: [data.odAmount ? data.odAmount : ""],
        typeOfLoan: [data.typeOfLoan ? data.typeOfLoan : ""],
        otherTypeOfloan: [data.otherTypeOfloan ? data.otherTypeOfloan : ""],
        odDpd: [data.odDpd ? data.odDpd : ""],
      });
    }
  }
  addOdDetails(data?: any) {
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.odAccountDetailsArray.push(this.getodListDetails(data[i]));
      }
    } else {
      this.odAccountDetailsArray.push(this.getodListDetails());
    }
    // this.odAccountDetailsArray.push(this.getodListDetails());
  }

  removeOdDetails(i?: any) {
    const id = this.odAccountDetailsArray.at(i).value.id;
    if (this.odAccountDetailsArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.odAccountDetailsArray.removeAt(i);
      } else {
        const body = {
          id: id,
          userId: this.userId,
        };
        this.odDetailsService
          .softDeleteOdDetails(body)
          .subscribe((res: any) => {
            this.odAccountDetailsArray.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
          });
      }
    } 
    // if (this.odAccountDetailsArray.controls.length > 0) {
    //   // tslint:disable-next-line: triple-equals
    //   this.odAccountDetailsArray.removeAt(i);
    // }
  }
  private getLoanEnquiryInThirtyDays(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        memberType: [""],
        enquiryDate: [""],
        typeOfLoan: [""],
        amount: [""],
        isSixtyDays: this.thirtyDays,
      });
    } else {
      return this.formBuilder.group({
        id: [data.id ? data.id : null],
        memberType: [data.memberType ? data.memberType : ""],
        enquiryDate: [data.enquiryDate ? data.enquiryDate : ""],
        typeOfLoan: [data.typeOfLoan ? data.typeOfLoan : ""],
        amount: [data.amount ? data.amount : ""],
        // isSixtyDays: [data.isSixtyDays ? data.isSixtyDays : this.thirtyDays],
      });
    }
  }
  addLastThirtyDaysLoan(data?: any) {
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.loanEnquiryInThirtyDaysArray.push(
          this.getLoanEnquiryInThirtyDays(data[i])
        );
      }
    } else {
      this.loanEnquiryInThirtyDaysArray.push(this.getLoanEnquiryInThirtyDays());
    }
    // this.loanEnquiryInThirtyDaysArray.push(this.getLoanEnquiryInThirtyDays());
  }
  removeLastThirtyDaysLoan(i?: any) {
    const id = this.loanEnquiryInThirtyDaysArray.at(i).value.id;
    if (this.loanEnquiryInThirtyDaysArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      if (id == undefined) {
        this.loanEnquiryInThirtyDaysArray.removeAt(i);
      } else {
        const body = {
          id: id,
          userId: this.userId,
        };
        this.odDetailsService
          .softDeleteOdDetails(body)
          .subscribe((res: any) => {
            this.loanEnquiryInThirtyDaysArray.removeAt(i);
            const message = res.ProcessVariables.error.message;
            this.toasterService.showSuccess(message, '');
          });
      }
    } 
    // if (this.loanEnquiryInThirtyDaysArray.controls.length > 0) {
    //   // tslint:disable-next-line: triple-equals
    //   this.loanEnquiryInThirtyDaysArray.removeAt(i);
    // }
  }
  private getLoanEnquiryInSixtyDays(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        memberType: [""],
        enquiryDate: [""],
        typeOfLoan: [""],
        amount: [""],
        isSixtyDays: this.thirtyDays,
      });
    } else {
      return this.formBuilder.group({
        id: [data.id ? data.id : null],
        memberType: [data.memberType ? data.memberType : ""],
        enquiryDate: [data.enquiryDate ? data.enquiryDate : ""],
        typeOfLoan: [data.typeOfLoan ? data.typeOfLoan : ""],
        amount: [data.amount ? data.amount : ""],
        // isSixtyDays: [data.isSixtyDays ? data.isSixtyDays : this.thirtyDays],
      });
    }
  }
  addLastSixtyDaysLoan(data?: any) {
    if (data && data.length > 0) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data.length; i++) {
        this.loanEnquiryInSixtyDaysArray.push(
          this.getLoanEnquiryInSixtyDays(data[i])
        );
      }
    } else {
      this.loanEnquiryInSixtyDaysArray.push(this.getLoanEnquiryInSixtyDays());
    }
  }
  removeLastSixtyDaysLoan(i?: any) {
    if (this.loanEnquiryInSixtyDaysArray.controls.length > 0) {
      // tslint:disable-next-line: triple-equals
      this.loanEnquiryInSixtyDaysArray.removeAt(i);
    }
  }
  get f() {
    return this.odDetailsForm.controls;
  }

  getOdDetails() {
    const body = {
      userId: this.userId,
      applicantId: this.applicantId,
    };
    this.odDetailsService.getOdDetails(body).subscribe((res: any) => {
      console.log("get od details---->", res);
      this.odDetails = res.ProcessVariables;
      console.log(this.odDetails);
      this.odDetails.bureauEnquiries.filter((ele) => {
        var isthirty = true;
        var isSixty = true
        console.log(ele.isSixtyDays == isthirty);
        console.log(ele.isSixtyDays == isSixty);

        if (ele.isSixtyDays == isthirty || !null) {
          console.log("hai");
          this.addLastThirtyDaysLoan(res.ProcessVariables.bureauEnquiries);
        } else if ((ele.isSixtyDays == isSixty || !null)) {
          console.log("hello");
          this.addLastSixtyDaysLoan(res.ProcessVariables.bureauEnquiries);
        }
      });

      this.addOdDetails(res.ProcessVariables.odAccountDetails);
      this.odDetailsForm.patchValue({
        totalAmount: this.odDetails.assetAppOdDetails.totalAmount,
      });
      this.odDetailsForm.patchValue({
        highDpd6m: this.odDetails.assetAppOdDetails.highDpd6m,
      });
      this.odDetailsForm.patchValue({
        highDpd12m: this.odDetails.assetAppOdDetails.highDpd12m,
      });
      this.odDetailsForm.patchValue({
        writtenOffLoans: this.odDetails.assetAppOdDetails.writtenOffLoans,
      });
      this.odDetailsForm.patchValue({
        writtenOffLoansWithSuite: this.odDetails.assetAppOdDetails.writtenOffLoansWithSuite,
      });
      this.odDetailsForm.patchValue({
        lossLoans: this.odDetails.assetAppOdDetails.lossLoans,
      });
      this.odDetailsForm.patchValue({
        settledLoans: this.odDetails.assetAppOdDetails.settledLoans,
      });
      this.odDetailsForm.patchValue({
        clearanceProofCollected: this.odDetails.assetAppOdDetails.clearanceProofCollected,
      });
      this.odDetailsForm.patchValue({
        clearenceProof: this.odDetails.assetAppOdDetails.clearenceProof,
      });
      this.odDetailsForm.patchValue({
        justification: this.odDetails.assetAppOdDetails.justification,
      });


      // this.addLastThirtyDaysLoan(res.ProcessVariables.bureauEnquiries);
      // this.addLastSixtyDaysLoan(res.ProcessVariables.bureauEnquiries);
    });
  }

  // getParentOdDetails() {
  //   const body = {
  //     userId: this.userId,
  //     applicantId: this.applicantId,

  //   };
  //   this.odDetailsService.getParentOdDetails(body).subscribe((res: any) => {
  //     console.log('get parent od details---->',res)
  //     // this.OdDetails = res.ProcessVariables;
  //     // console.log(this.OdDetails);

  //     // this.addOdDetails(res.ProcessVariables.odAccountDetails);
  //     // this.addLastThirtyDaysLoan(res.ProcessVariables.bureauEnquiries);
  //     // this.addLastSixtyDaysLoan(res.ProcessVariables.bureauEnquiries);
  //   });
  // }
  onSubmit() {
    this.submitted = true;
    console.log(this.odDetailsForm);

    // stop here if form is invalid
    if (this.odDetailsForm.invalid) {
      this.toasterService.showError(
        "Fields Missing Or Invalid Pattern Detected",
        "Cibil OD Details"
      );
      return;
    } else {
      this.submitted = true;

      this.toasterService.showSuccess("Saved Successfully", "Cibil OD Details");
      const AssetBureauEnquiry = [];
      this.odDetailsForm.value.loanEnquiryInThirtyDays.forEach((element) => {
        AssetBureauEnquiry.push(element);
      });
      this.odDetailsForm.value.loanEnquiryInSixtyDays.forEach((element) => {
        AssetBureauEnquiry.push(element);
      });
      console.log("AssetBureauEnquiry", AssetBureauEnquiry);
      AssetBureauEnquiry.forEach((ele) => {
        console.log(ele);

        ele.memberType = ele.memberType.toString();
        ele.enquiryDate = this.utilityService.convertDateTimeTOUTC(
          ele.enquiryDate,
          "DD/MM/YYYY"
        );
        // ele.enquiryDate = (ele.enquiryDate).toString();
        ele.typeOfLoan = ele.typeOfLoan.toString();
        ele.amount = Number(ele.amount);
        ele.isSixtyDays = ele.isSixtyDays;
      });
      this.odDetailsForm.value.odAccountDetails.forEach((ele) => {
        ele.odType = ele.odType.toString();
        ele.otherTypeOfloan = ele.otherTypeOfloan.toString();
        ele.typeOfLoan = ele.typeOfLoan.toString();
        ele.odAmount = Number(ele.odAmount);
        ele.odDpd = Number(ele.odDpd);
      });

      const body = {
        userId: this.userId,
        applicantId: this.applicantId,
        odAccountDetails: this.odDetailsForm.controls.odAccountDetails.value,
        AssetBureauEnquiry: AssetBureauEnquiry,

        assetAppOdDetails: {
          clearanceProof: this.odDetailsForm.controls.clearenceProof.value,
          clearanceProofCollected: this.odDetailsForm.controls
            .clearanceProofCollected.value,
          highDpd12m: this.odDetailsForm.controls.highDpd12m.value,
          highDpd6m: this.odDetailsForm.controls.highDpd6m.value,
          justification: this.odDetailsForm.controls.justification.value,
          lossLoans: Number(this.odDetailsForm.controls.lossLoans.value),
          settledLoans: Number(this.odDetailsForm.controls.settledLoans.value),
          writtenOffLoans: Number(
            this.odDetailsForm.controls.writtenOffLoans.value
          ),
          writtenOffLoansWithSuite: Number(
            this.odDetailsForm.controls.writtenOffLoansWithSuite.value
          ),
          totalAmount: this.totalOdAmount.toString(),
        },

        // odAccountDetails : { ...this.odAccountDetailsArray.value}
      };
      console.log(body);

      this.odDetailsService.saveParentOdDetails(body).subscribe((res: any) => {
        console.log("post od details--->", res);
      });
    }
  }
  onOdAmount(event: any, i: number) {
    const odAmount = this.odAccountDetailsArray.value[i].odAmount;
    const totalOdAmount = odAmount;
    this.odAccountDetailsArray.at(i).patchValue({ totalOdAmount });
    if (this.odAccountDetailsArray && this.odAccountDetailsArray.length > 0) {
      this.totalOdAmount = 0;
      for (let i = 0; i < this.odAccountDetailsArray.length; i++) {
        this.totalOdAmount = Math.round(
          this.totalOdAmount +
          Number(this.odAccountDetailsArray.value[i].odAmount)
        );
      }
    }
  }
  onBackToApplicant() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/cibil-od`);
  }
}
