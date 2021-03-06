import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    productCode?: any,
    flowStage: string,
    rejectReasonList?: any
  }
  @Input() showModalPopup: boolean;
  @Output() okay = new EventEmitter();
  @Output() cancel = new EventEmitter();

  isReason: boolean;
  reasonData: any;
  showRejectModal: boolean;
  product: any;
  productCode: string;
  constructor(
    private CreateLeadService: CreateLeadService
  ) {

  }

  ngOnInit() {

  }


  ngOnChanges() {

    console.log(this.data);
    this.product = Number(this.data.product);
    this.productCode = this.data.productCode;

    this.CreateLeadService.rejectLead(this.data.flowStage, this.product, this.productCode).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        const rejectReasonList = response.ProcessVariables.assetRejectReason;
        this.data.rejectReasonList = rejectReasonList;
      }
    });



  }


  getReason(reason) {
    console.log('reason',reason.target.value)
    this.isReason = true;
    this.reasonData = reason.target.value;
    
  }

  onOkay() {
    this.okay.emit({
      reason: {
        reasonCode: this.reasonData
      }
    });
  }
  onCancel() {
    this.cancel.emit();
  }

}
