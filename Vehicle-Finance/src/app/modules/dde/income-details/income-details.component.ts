import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";

import { LabelsService } from "src/app/services/labels.service";
import { IncomeDetailsService } from "@services/income-details.service";
import { CommomLovService } from "@services/commom-lov-service";

@Component({
  selector: "app-income-details",
  templateUrl: "./income-details.component.html",
  styleUrls: ["./income-details.component.css"],
})
export class IncomeDetailsComponent implements OnInit {
  labels: any = {};
  incomeDetailsForm: FormGroup;
  otherDetailsForm: FormGroup;
  formData: any;
  getBuisinessIncomeId: any;
  otherApplicantType = [];
  leadId: 61;
  userId: "1002";
  applicantDetails: any;
  ngApplicantId: any;
  patchPath = false;
  setPath = true;
  applicantResponse: any;
  applicantBusinessType = [];
  applicantObligayionType = [];
  businessApplicantId: number;
  otherId: number;
  incomeLov: any = [];
  array = [];
  applicantType: any;
  applicantId: number;
  constructor(
    private route: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private incomeDetailsService: IncomeDetailsService,
    private commonLovService: CommomLovService
  ) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => { }
    );

    const body = {
      name: "S",
      leadId: 606,
    };
    this.getLov();
    this.incomeDetailsService
      .getAllAplicantDetails(body)
      .subscribe((res: any) => {
        this.applicantDetails = res.ProcessVariables.applicantInfoObj;
      });
    this.incomeDetailsForm = this.formBuilder.group({
      businessIncomeDetails: this.formBuilder.array([]),
      otherIncomeDetails: this.formBuilder.array([]),
      obligationDetails: this.formBuilder.array([]),
      leadId: 601,
      userId: "1002",
    });
    this.getAllIncome();
  }
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      this.incomeLov.incomeType = value.LOVS.incomeType;
      this.incomeLov.typeOfLoan = value.LOVS.typeOfLoan;
      this.incomeLov.bankMaster = value.LOVS.bankMaster;

    });
  }
  private getBusinessIncomeDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: Number(null),
        applicantType: ["" || ""],
        businessEnterpriseName: ["" || "ABC Enterprises"],
        depreciation: Number(12),
        directorSalary: Number(3534),
        grossDerivedIncome: Number(33535),
        grossMonthlyIncome: Number(4543),
        netProfit: Number(45435),
      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : 0,
        applicantId: Number(data.applicantId ? data.applicantId : null),
        applicantType: data.applicantTypeValue ? data.applicantTypeValue : "",
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : "",
        businessEnterpriseName: data.businessEnterpriseName
          ? data.businessEnterpriseName
          : "Abc Enterprises",
        depreciation: Number(data.depreciation ? data.depreciation : ""),
        directorSalary: Number(data.directorSalary ? data.directorSalary : ""),
        grossDerivedIncome: Number(
          data.grossDerivedIncome ? data.grossDerivedIncome : ""
        ),
        grossMonthlyIncome: Number(
          data.grossMonthlyIncome ? data.grossMonthlyIncome : ""
        ),
        netProfit: Number(data.netProfit ? data.netProfit : ""),
      });
    }
  }
  private getOtherIncomeDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: Number(null),
        applicantType: ["" || ""],
        incomeType: ["" || "salary"],
        grossIncome: Number(52000),
        factoring: Number(25),
        factoredIncome: Number(25000),
      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : 0,
        applicantId: Number(data.applicantId ? data.applicantId : ""),
        applicantType: data.applicantTypeValue ? data.applicantTypeValue : "",
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : "",
        incomeType: data.incomeType ? data.incomeType : "salaryType",
        grossIncome: Number(data.grossIncome ? data.grossIncome : ""),
        factoring: Number(data.factoring ? data.factoring : ""),
        factoredIncome: Number(data.factoredIncome ? data.factoredIncome : ""),
      });
    }
  }
  private getObligationDetails(data?: any) {
    if (data === undefined) {
      return this.formBuilder.group({
        applicantId: Number(null),
        applicantType: ["" || ""],
        loanType: ["" || "Business Loan"],
        financier: ["" || ""],
        loanAmount: Number(25000),
        tenure: Number(12),
        mob: Number(32434),
        emi: Number(2344),
        balanceTenure: Number(234343),
        obligationAmount: Number(23456),
      });
    } else {
      return this.formBuilder.group({
        id: data.id ? data.id : null,
        applicantId: Number(data.applicantId ? data.applicantId : ""),
        applicantType: data.applicantTypeValue ? data.applicantTypeValue : "",
        applicantTypeValue: data.applicantTypeValue
          ? data.applicantTypeValue
          : "",
        loanType: data.loanType ? data.loanType : "",
        financier: data.financier ? data.financier : "",

        loanAmount: Number(data.loanAmount ? data.loanAmount : ""),
        tenure: Number(data.tenure ? data.tenure : ""),
        mob: Number(data.mob ? data.mob : ""),
        emi: Number(data.emi ? data.emi : ""),
        balanceTenure: Number(data.balanceTenure ? data.balanceTenure : ""),
        obligationAmount: Number(
          data.obligationAmount ? data.obligationAmount : ""
        ),
      });
    }
  }
  addBusinessIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .businessIncomeDetails as FormArray;
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        control.push(this.getBusinessIncomeDetails(data[i]));
      }
    } else {
      control.push(this.getBusinessIncomeDetails());
    }
  }
  removeBusinessIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    let id = control.at(i).value.id
    if (control.controls.length > 1) {
      const body = {
        userId: "1002",
        aBusinessIncomeDetail: { id: id },
      };
      this.incomeDetailsService
        .softDeleteIncomeDetails(body)
        .subscribe((res: any) => {
          control.removeAt(i);
        });
    } else {
      alert("Atleast One Row Required");
    }
  }

  addOtherIncomeUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        control.push(this.getOtherIncomeDetails(data[i]));
      }
    } else {
      control.push(this.getOtherIncomeDetails());
    }
  }
  removeOtherIncomeIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .otherIncomeDetails as FormArray;
    let id = control.at(i).value.id

    if (control.controls.length > 1) {
      const body = {
        userId: "1002",

        otherIncomeDetail: { id: id },
      };
      control.removeAt(i);

      this.incomeDetailsService
        .softDeleteIncomeDetails(body)
        .subscribe((res: any) => {
        });
    } else {
      alert("Atleast One Row Required");
    }
  }
  addObligationUnit(data?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        control.push(this.getObligationDetails(data[i]));
      }
    } else {
      control.push(this.getObligationDetails());
    }
  }
  removeObligationIndex(i?: any) {
    const control = this.incomeDetailsForm.controls
      .obligationDetails as FormArray;
    let id = control.at(i).value.id

    if (control.controls.length > 1) {
      const body = {
        userId: "1001",
        obligationDetail: { id: id },
      };
      this.incomeDetailsService
        .softDeleteIncomeDetails(body)
        .subscribe((res: any) => {
          control.removeAt(i);
        });
    } else {
      alert("Atleast One Row Required");
    }
  }

  getAllIncome() {
    const body = {
      leadId: 601,
    };
    this.incomeDetailsService
      .getAllIncomeDetails(body)
      .subscribe((res: any) => {
        this.applicantResponse = res.ProcessVariables;
        this.addBusinessIncomeUnit(res.ProcessVariables.businessIncomeList);
        this.addOtherIncomeUnit(res.ProcessVariables.otherIncomeList);
        this.addObligationUnit(res.ProcessVariables.obligationsList);
      });
  }
  onBusinessApplicantChange(event?: any, i?: number) {

    let applicantType = this.applicantDetails.find((res) => res.applicantId == event).applicantType
    const control = this.incomeDetailsForm.controls.businessIncomeDetails as FormArray;
    control.at(i).get("applicantType").setValue(applicantType)

  }

  onOtherApplicantChange(event, i?: number) {
    let applicantType = this.applicantDetails.find((res) => res.applicantId == event).applicantType
    const control = this.incomeDetailsForm.controls.otherIncomeDetails as FormArray;
    control.at(i).get("applicantType").setValue(applicantType)
  }

  onObligationApplicantChange(event, i?: number) {
    let applicantType = this.applicantDetails.find((res) => res.applicantId == event).applicantType
    const control = this.incomeDetailsForm.controls.obligationDetails as FormArray;
    control.at(i).get("applicantType").setValue(applicantType)
  }

  onSubmit() {

    this.incomeDetailsService
      .setAllIncomeDetails(this.incomeDetailsForm.value)
      .subscribe((res: any) => {

      });
  }
}
