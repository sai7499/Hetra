import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-exposure-details',
  templateUrl: './exposure-details.component.html',
  styleUrls: ['./exposure-details.component.css']
})
export class ExposureDetailsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  exposureLiveLoan: FormGroup;
  ngOnInit() {
    this.exposureLiveLoan = this.formBuilder.group({
      loanTable: this.formBuilder.array([ this.getLiveLoan() ])
    });
  }
  private getLiveLoan() {
    return this.formBuilder.group({
      loanType: [''],
      loanNumber: ['' || '55601'],
      assetType: ['' ],
      yearOfManufacture: ['' || '2015'],
      gridValue: ['' || '55'],
      LTV: ['' || '80'],
      currentPOS: ['' || 34],
      tenure: ['' || '60'],
      emiPaid: ['' || '40']
    });
  }
  addUnit() {
    // tslint:disable-next-line:no-string-literal
    // tslint:disable-next-line:no-angle-bracket-type-assertion
    // tslint:disable-next-line: no-string-literal
    const control = this.exposureLiveLoan.controls['loanTable'] as FormArray;
    control.push(this.getLiveLoan());
  }
  removeIndex(i?: any) {
    // tslint:disable-next-line:no-string-literal
    const control = this.exposureLiveLoan.controls['loanTable'] as FormArray;
    console.log(control.controls.length);
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
