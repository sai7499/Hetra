import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CreateLeadService } from '../../lead-creation/service/creatLead.service';


@Component({
  selector: 'app-reject-reason-modal',
  templateUrl: './reject-reason-modal.component.html',
  styleUrls: ['./reject-reason-modal.component.css']
})
export class RejectReasonModalComponent implements OnInit {

  @Input() data: {
    title: string,
    product: any;
    productCode?:any,
    flowStage: string,
    rejectReasonList?: any
}
@Input() showModalPopup: boolean;
@Output() okay = new EventEmitter();
@Output() cancel = new EventEmitter();

 isReason: boolean;
 reasonData: any;
  constructor(
    private CreateLeadService: CreateLeadService
  ) { 
    
  }

  ngOnInit() {

  }


  ngOnChanges() {

    console.log(this.data)

    const productId = Number(this.data.product) || this.data.productCode;
    this.CreateLeadService.rejectLead(productId,this.data.flowStage).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        const rejectReasonList = response.ProcessVariables.assetRejectReason;
        this.data.rejectReasonList = rejectReasonList   
      }
    });

  }


  getReason(reason) {
    this.isReason = true;
    this.reasonData = reason;
    console.log(reason)
  }

  onOkay() {
      this.okay.emit({
        reason: this.reasonData
      });
  }
  onCancel() {
    this.cancel.emit();
  }

}
