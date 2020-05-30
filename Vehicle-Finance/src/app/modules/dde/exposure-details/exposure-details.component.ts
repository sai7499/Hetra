import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-exposure-details',
  templateUrl: './exposure-details.component.html',
  styleUrls: ['./exposure-details.component.css']
})
export class ExposureDetailsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private labelService: LabelsService) { }
  exposureLiveLoan: FormGroup;
  exposureProposedLoan: FormGroup;
  labels: any = {};

  ngOnInit() {
    this.exposureLiveLoan = this.formBuilder.group({
      loanTable: this.formBuilder.array([this.getLiveLoan()])
    });
    this.exposureProposedLoan = this.formBuilder.group({
      proposedTable: this.formBuilder.array([this.getProposedLoan()])
    });
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      console.log('res in exposure', res);
    });
  }
  public getProposedLoan() {
    return this.formBuilder.group({
      loanType: [''],
      loanNumber: ['' || '55601'],
      assetType: [''],
      yearOfManufacture: ['' || '2015'],
      gridValue: ['' || '55'],
      LTV: ['' || '80'],
      currentPOS: ['' || 34],
      tenure: ['' || '60'],
      emiPaid: ['' || '40']
    });
  }
  private getLiveLoan() {
    return this.formBuilder.group({
      loanType: [''],
      loanNumber: ['' || '55601'],
      assetType: [''],
      yearOfManufacture: ['' || '2015'],
      gridValue: ['' || '55'],
      LTV: ['' || '80'],
      currentPOS: ['' || 34],
      tenure: ['' || '60'],
      emiPaid: ['' || '40']
    });
  }
  addUnit() {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    control.push(this.getLiveLoan());
  }
  // get formArr() {
  //   return this.exposureLiveLoan.get("loanTable") as FormArray;
  // }
  // get formArrProposed() {
  //   return this.exposureLiveLoan.get("proposedTable") as FormArray;
  // }
  removeIndex(i?: any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert('Atleast One Row Required');
    }
  }
  addProposedUnit() {
    const control = this.exposureProposedLoan.controls.proposedTable as FormArray;
    control.push(this.getLiveLoan());
  }
  removeProposedIndex(i?: any) {
    const control = this.exposureProposedLoan.controls.proposedTable as FormArray;
    // console.log(control.controls.length);
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert('Atleast One Row Required');
    }
  }
  onSubmit() {
    console.log(this.exposureLiveLoan.value);
  }
}
