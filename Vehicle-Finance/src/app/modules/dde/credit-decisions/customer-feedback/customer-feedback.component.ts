import { Component, OnInit } from '@angular/core';
import { CustomerAcceptanceServiceService } from '@services/customer-acceptance-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.css']
})
export class CustomerFeedbackComponent implements OnInit {
  leadId: number;

  constructor(private customerService: CustomerAcceptanceServiceService, private route: ActivatedRoute,
              private router: Router, private toasterService: ToasterService) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
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
  customerAcceptance(data: string) {
    if (data === 'accepted') {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isAccepted: true
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
        isAccepted: false
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
    }
   
  }

}
