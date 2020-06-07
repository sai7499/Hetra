import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ExposureService } from '@services/exposure.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-exposure-details',
  templateUrl: './exposure-details.component.html',
  styleUrls: ['./exposure-details.component.css']
})
export class ExposureDetailsComponent implements OnInit {
  leadId: number;
  userId: string;
  getExposureDetails: any;
  liveloanArray = [];
  proposedArray = [];
  constructor(private formBuilder: FormBuilder, private labelService: LabelsService,
              private exposureservice: ExposureService,
              private commonservice: CommomLovService,
              private route: Router,
              private activatedRoute: ActivatedRoute ) { }
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
      loanTable: this.formBuilder.array([]),
      proposedTable: this.formBuilder.array([])
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
    console.log(this.route);
    console.log(this.activatedRoute, ' activated route');
    // this.leadId = (await this.getLeadId()) as number;
    console.log(this.leadId, 'leadId');
    this.userId = localStorage.getItem('userId');
    console.log(this.userId);
    this.getExposure();

  }
  async getExposure() {
    this.leadId = (await this.getLeadId()) as number;
    this.exposureservice.getExposureDetails({leadId : this.leadId}).subscribe((res: any) => {
      this.getExposureDetails = res.ProcessVariables.exposure;
      console.log(this.getExposureDetails);
      if (this.getExposureDetails && this.getExposureDetails.length > 0 ) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.getExposureDetails.length; i++) {
          if (this.getExposureDetails[i].loanDesc === 'Proposed') {
          this.proposedArray.push(this.getExposureDetails[i]);
          } else {
            this.liveloanArray.push(this.getExposureDetails[i]);
          }
        }
        this.addUnit(this.liveloanArray);
        this.addProposedUnit(this.proposedArray);
      } else {
        this.addUnit(null);
        this.addProposedUnit(null);
       }
    });
    console.log(this.liveloanArray, 'live loan');
    console.log(this.proposedArray, 'proposed');

  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  public getProposedLoan(data?: any) {
    if (!data || data === null || undefined) {
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
    } else {
    return this.formBuilder.group({
      id: [data.id ? data.id : null],
      loanType: [data.loanType ? data.loanType : ''],
      loanNo: [data.loanNo ? data.loanNo  : '' ],
      assetType: [data.assetType ? data.assetType : ''],
      yom: [data.yom ? data.yom : '' ],
      gridValue: [data.gridValue ? data.gridValue : '' ],
      ltv: [data.ltv ? data.ltv : '' ],
      currentPos: [data.currentPos ? data.currentPos : '' ],
      tenure: [data.tenure ? data.tenure : '' ],
      emiPaid: [data.emiPaid ? data.emiPaid : '']
    });
    }
  }
  private getLiveLoan(data?: any) {
    if (!data || data === null || undefined) {
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
    } else {
    return this.formBuilder.group({
      id: [data.id ? data.id : null],
      loanType: [data.loanType ? data.loanType : ''],
      loanNo: [data.loanNo ? data.loanNo  : '' ],
      assetType: [data.assetType ? data.assetType : ''],
      yom: [data.yom ? data.yom : '' ],
      gridValue: [data.gridValue ? data.gridValue : '' ],
      ltv: [data.ltv ? data.ltv : '' ],
      currentPos: [data.currentPos ? data.currentPos : '' ],
      tenure: [data.tenure ? data.tenure : '' ],
      emiPaid: [data.emiPaid ? data.emiPaid : '']
    });
    }
  }
  addUnit(data?: any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    if (data && data.length > 0 ) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < data.length; i++) {
        control.push(this.getProposedLoan(data[i]));
      }
    } else {
      control.push(this.getProposedLoan(null));
    }
  }

  removeIndex(i?: any) {
    const control = this.exposureLiveLoan.controls.loanTable as FormArray;
    console.log(control.controls.length);
    const id = this.liveloanArray[i].id ? this.liveloanArray[i].id : null;
    const body = {
        id,
        userId: this.userId
      };
    this.exposureservice.deleteExposureDetails(body).subscribe((res: any) => {
        console.log(res);
        control.removeAt(i);
        alert(res.ProcessVariables.error.message);
      });
    if (control.controls.length === 1) {
        this.addUnit(null);
      }
  }
addProposedUnit(data?: any) {
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    if (data && data.length > 0 ) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < data.length; i++) {
        control.push(this.getLiveLoan(data[i]));
      }
    } else {
      control.push(this.getLiveLoan(null));
    }
  }
removeProposedIndex(i?: any) {
    const control = this.exposureLiveLoan.controls.proposedTable as FormArray;
    const id = this.proposedArray[i].id;
    console.log(id, ' id for delete');
    const body = {
        id,
        userId: this.userId
      };
    this.exposureservice.deleteExposureDetails(body).subscribe((res: any) => {
        console.log(res);
        control.removeAt(i);
        alert(res.ProcessVariables.error.message);
      });
    if (control.controls.length === 1) {
        this.addProposedUnit(null);
      }
    }
  // }

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
    const body = {
       leadId: this.leadId,
       userId: this.userId,
       exposures : arrayData
    };
    this.exposureservice.setExposureDetails(body).subscribe((res: any) => {
      console.log(res, ' response in exposure');
    });
  }
}
