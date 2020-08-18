import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { ChequeTrackingService } from '@services/cheque-tracking.service'

@Component({
  selector: 'app-cheque-tracking',
  templateUrl: './cheque-tracking.component.html',
  styleUrls: ['./cheque-tracking.component.css']
})
export class ChequeTrackingComponent implements OnInit {
  labels: any = {};
  validationData: any;
  LOV: any = [];
  statusLov = [];
  status: any;
  leadId: number;
  chequeData = [];
  selectedData: any;
  chequeForm : FormGroup

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public utilityService: UtilityService,
    private toasterService: ToasterService,
    private chequeTrackingService: ChequeTrackingService
  ) { }

  async ngOnInit() {
     this.initForm()

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLOV();
    this.leadId = (await this.getLeadId()) as number;
    console.log('leadid', this.leadId)
    this.getChequeTrckingData();
  }
  initForm(){
     this.chequeForm= new FormGroup({
       status : new FormControl(''),
       remarks : new FormControl('')
     })
  }

  getLeadId() {
    return new Promise((resolve) => {
      this.activatedRoute.parent.params.subscribe((value: any) => {
        if (!value.leadId) {
          resolve(null);
        }
        resolve(Number(value.leadId));
      });
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      console.log('lov', this.LOV)
    });
  }
  getChequeTrckingData() {
    const data = {
      leadId: 1178,
      loanNumber: ""
    }
    this.chequeTrackingService.getChequeTracking(data).subscribe((res) => {
      console.log('res', res)
      if (res['ProcessVariables'].error.code == '0') {
        this.chequeData = res['ProcessVariables'].chequeData;
      }
    })
  }

  onChangeStatus(event){
    const value= event.target.value;
    const status= this.LOV.LOVS.chequeStatus
    const findValue=status.find(element=>element.key==value)
    this.selectedData.chequeStatus= findValue.value
  }
  onGetChequeData(data) {
    console.log('data', data)
    this.selectedData = data;
    this.chequeForm.get('status').setValue('')
  }
  onUpdate() {
    const value= this.chequeForm.value
    const chequeData = {
      chequeAmt: this.selectedData.chequeAmt,
      chequeDate: this.selectedData.chequeDate,
      chequeNum: this.selectedData.chequeNum,
      chequeStatus: this.selectedData.chequeStatus,
      disbId: this.selectedData.disbId,
      favTo: this.selectedData.favTo,
      mode: this.selectedData.mode,
      payableTo: this.selectedData.payableTo,
      statusUpdatedOn: this.selectedData.statusUpdatedOn,
      remarks: value.remarks

    }
    const data={
      leadId : this.leadId,
      chequeData :{
        ...chequeData
      }
    }
    this.chequeTrackingService.saveUpdateChequeTracking(data).subscribe((res)=>{
      console.log('res', res)
    })
    // this.router.navigate([`/pages/dashboard`]);
  }
  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

}
