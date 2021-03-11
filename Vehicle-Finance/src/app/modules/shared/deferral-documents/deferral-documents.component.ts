import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from "@services/labels.service";
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-deferral-documents',
  templateUrl: './deferral-documents.component.html',
  styleUrls: ['./deferral-documents.component.css']
})
export class DeferralDocumentsComponent implements OnInit {
  deferralForm: FormGroup;
  toDayDate : Date = new Date();
  isLoan360 : boolean = false;
  docArray = [
    { docName: 1, defDate: '09/01/2021', view: 68123, rcvdBy: 'BM', rcvdOn: '' },
    { docName: 2, defDate: '10/01/2021', view: 68123, rcvdBy: 'AM', rcvdOn: '' },
    { docName: 3, defDate: '11/01/2021', view: 68123, rcvdBy: 'AM', rcvdOn: '' }
  ]

  docName = [
    {
      key: 1,
      value: 'FC-Copy'
    },
    {
      key: 2,
      value: 'ENDORSEMENT-Copy'
    },
    {
      key: 3,
      value: 'RC-Copy'
    }
  ]

  rcvdBy = [
    {
      key: 'BM',
      value: 'BM-User'
    },
    {
      key: 'AM',
      value: 'ACM-User'
    }
  ]
  rcvdOn: Date;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private labelsData: LabelsService,
    private router: Router,
    private utilityService: UtilityService,
  ) { 
    var date = this.toDayDate.getDate()
    var month = this.toDayDate.getMonth()
    var year = this.toDayDate.getFullYear()
    var hour = this.toDayDate.getHours()
    var minute = this.toDayDate.getMinutes()
    this.rcvdOn = new Date(year, month, date, hour , minute)
   }

  ngOnInit() {
    this.initForm()
  }
  initForm() {
    this.deferralForm = new FormGroup({
      defDocumentArray: new FormArray([])
    })

    this.initRows(this.docArray)
  }

  initRows(data) {
    //   if (!data) {
    //     return;
    // }
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    data.forEach((value) => {
      const formGroup = new FormGroup({
        docName: new FormControl(value.docName || ''),
        defDate: new FormControl(this.utilityService.getDateFromString(value.defDate) || ''),
        rcvdBy: new FormControl(value.rcvdBy || ''),
        rcvdOn: new FormControl({value : this.utilityService.getDateFromString(value.rcvdOn) || this.rcvdOn, disabled : true}),
      });
      formArray.push(formGroup);
    });
  }

  onSave(){

  }

  onSubmit(){
    
  }

}
