import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApplicantService } from "@services/applicant.service";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {

  applicantDetails: any = [];

  authorizeForm: FormGroup;
  leadId: any;

  constructor(private _fb: FormBuilder, private applicantService: ApplicantService,
     private route: ActivatedRoute) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;

    this.authorizeForm = this._fb.group({
      applicantFormArray: this._fb.array([])
    })

    this.getAuthorizeDetails()

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

  getAuthorizeDetails() {

    let data = {
      "leadId": this.leadId,
      "userId": localStorage.getItem('userId')
    }

    this.applicantService.getAuthorizeDetails(data).subscribe((res: any) => {
      console.log('res', res)

      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.applicantDetails = res.ProcessVariables.ckycDetails ? res.ProcessVariables.ckycDetails : [];
        if (res.ProcessVariables.ckycDetails && res.ProcessVariables.ckycDetails.length > 0) {

        }
      } else {

      }
    })
  }

}