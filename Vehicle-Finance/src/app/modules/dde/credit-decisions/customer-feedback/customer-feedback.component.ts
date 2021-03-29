import { Component, OnInit } from '@angular/core';
import { CustomerAcceptanceServiceService } from '@services/customer-acceptance-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '../../../shared/shared-service/shared-service'
import { LabelsService } from '@services/labels.service';


@Component({
  selector: 'app-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.css']
})
export class CustomerFeedbackComponent implements OnInit {
  leadId: number;

  rejectData: {
    title: string,
    product: any;
    flowStage: string;
    productCode: any;
   
  }

  showModal: boolean;
  taskId: any;
  modalDetails: any;
  modalButtons: any;
  acceptedModal : boolean;

  constructor(private customerService: CustomerAcceptanceServiceService, private route: ActivatedRoute,
              private router: Router, private toasterService: ToasterService, private sharedService: SharedService,
              private labelsData: LabelsService,) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    this.labelsData.getModalDetails().subscribe((data)=>{
      const details = data.customerAcceptedOffer.custAcptOffer;
      this.modalDetails = details.modalDetails,
      this.modalButtons = details.modalButtons

    })
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }
  customerAcceptance(data: string,reasonCode?:string) {
    if (data === 'accepted') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isAccepted: true,
        taskId: this.taskId,
      };
      this.customerService.sendAcceptanceDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.toasterService.showSuccess('Record Saved Succesfully', '');
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
    } else {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isAccepted: false,
        reasonCode: reasonCode,
        taskId: this.taskId,
      };
      this.customerService.sendAcceptanceDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          this.toasterService.showSuccess('Record Rejected Succesfully', '');
          this.router.navigate([`pages/dashboard`]);
        } else {
          this.toasterService.showError(res.ProcessVariables.error.message, '');
        }
      });
    }
   
  }

  reject() {

    let productCode = ''
    this.sharedService.productCatCode$.subscribe((value)=> {

      productCode = value;
    })
    const productId = productCode || '';
    this.showModal = true;
    this.rejectData = {
      title: 'Select Reject Reason',
      product:'',
      productCode: productId,
      flowStage: '130'
    }
    
  }

  onOkay(reasonData) {
    
    this.customerAcceptance('rejected',reasonData['reason'].reasonCode)
  }

  onCancel() {
    this.showModal = false;
  }

}
