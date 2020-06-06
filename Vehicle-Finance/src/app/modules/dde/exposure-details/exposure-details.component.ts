import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ExposureService } from '@services/exposure.service';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-exposure-details',
  templateUrl: './exposure-details.component.html',
  styleUrls: ['./exposure-details.component.css']
})
export class ExposureDetailsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private labelService: LabelsService,
              private exposureservice: ExposureService,
              private commonservice: CommomLovService ) { }
  exposureLiveLoan: FormGroup;
  exposureProposedLoan: FormGroup;
  labels: any = {};
  lovData: any;
 productCategory = [
   {
    key: 'UCV',
    value: 'Used CV'
   },
   {
    key: 'NCV',
    value: 'New CV'
   },
   {
    key: 'UC',
    value: 'Used Car'
   },
   {
    key: 'NC',
    value: 'New Car'
   }
  ];
  ngOnInit() {
    this.exposureLiveLoan = this.formBuilder.group({
      loanTable: this.formBuilder.array([this.getLiveLoan()]),
      proposedTable: this.formBuilder.array([this.getProposedLoan()])
    });
    // this.exposureProposedLoan = this.formBuilder.group({
    //   proposedTable: this.formBuilder.array([this.getProposedLoan()])
    // });
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
    });
    this.commonservice.getLovData().subscribe((res: any) => {
      console.log(res.LOVS);
      this.lovData = res.LOVS;
    });

  }
  public getProposedLoan() {
    return this.formBuilder.group({
      loanType: [''],
      loanNo: ['' ],
      assetType: [''],
      yom: ['' ],
      gridValue: ['' ],
      ltv: ['' ],
      currentPos: ['' ],
      tenure: ['' ],
      emiPaid: ['' ]
    });
  }
  private getLiveLoan() {
    return this.formBuilder.group({
      loanType: [''],
      loanNo: ['' ],
      assetType: [''],
      yom: ['' ],
      gridValue: ['' ],
      ltv: ['' ],
      currentPos: ['' ],
      tenure: ['' ],
      emiPaid: ['']
    });
  }
  addUnit() {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    control.push(this.getLiveLoan());
  }

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
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    control.push(this.getLiveLoan());
  }
  removeProposedIndex(i?: any) {
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    if (control.controls.length > 1) {
      control.removeAt(i);
    } else {
      alert('Atleast One Row Required');
    }
  }

  onSubmit() {
    // tslint:disable-next-line: prefer-const
    let arrayData = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i <  this.exposureLiveLoan.value.loanTable.length; i++ ) {
     arrayData.push(this.exposureLiveLoan.value.loanTable[i]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i <  this.exposureLiveLoan.value.proposedTable.length; i++ ) {
      arrayData.push(this.exposureLiveLoan.value.proposedTable[i]);
     }

    //  const data = {
    //   ...this.exposureLiveLoan.value.loanTable,
    //     ...this.exposureLiveLoan.value.proposedLoan
    //  };
    console.log(arrayData, 'final data');
    this.exposureservice.setExposureDetails(arrayData).subscribe((res: any) => {
      console.log(res, ' response in exposure');
    });
  }
}
