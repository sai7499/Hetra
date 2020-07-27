import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';
import { OtpServiceService } from '../services/otp-details.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApplicantService } from '@services/applicant.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-otp-section',
  templateUrl: './otp-section.component.html',
  styleUrls: ['./otp-section.component.css'],
})
export class OtpSectionComponent implements OnInit {
  public otpForm: FormGroup;
  applicantId: String;
  leadId: number;
  userId: number;
  referenceNo: string;
  mobileNo: string;
  otp: number;
  applicantList: any;

  constructor(
    private _fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private loginStoreService: LoginStoreService,
    private otpService: OtpServiceService,
    private applicantService: ApplicantService,
    private router: Router,
    private toasterService: ToasterService
  ) { }

  getLeadIdAndApplicantId() {
    return new Promise((resolve) => {
      this.activatedRoute.params.subscribe((value: any) => {
        if (value) {
          // console.log('getApplicantId', value);
          resolve(Number(value.id));
        }
        resolve(null);
      });
    });
  }

  async ngOnInit() {
    // accessing applicant id if from route

    this.applicantId = (await this.getLeadIdAndApplicantId()) as string;
    console.log(this.applicantId);
    this.leadId = (await this.getLeadId()) as number;

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;

    // / calling send otp method

    // await this.getApplicantList()

    this.otpForm = this._fb.group({
      otp: [
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('[0-9]*'),
          Validators.required,
        ]),
      ],
    });
    this.sendOtp();
  }

  getLeadId() {
    // console.log("in getleadID")
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          // console.log("in if", value.leadId)
          resolve(Number(value.leadId));
          // console.log("after resolve", value.leadId)
        }
        resolve(null);
      });
    });
  }

  // getApplicantList() {
  //   const data = {
  //     leadId: this.leadId,
  //   };
  //   this.applicantService.getApplicantList(data).subscribe((value: any) => {
  //     // console.log('Applicantlist', value);
  //     const processVariables = value.ProcessVariables;
  //     // console.log('ProcessVariables', processVariables);
  //     this.applicantList = processVariables.applicantListForLead;
  //     console.log(this.applicantList)
  //     for (const index in this.applicantList) {
  //       console.log("in for")
  //       console.log(this.applicantId, "current appid")
  //       console.log((this.applicantList[index]['applicantId']));

  //       if (Number(this.applicantId) == this.applicantList[index]['applicantId']) {

  //         console.log("in if")
  //         this.mobileNo = this.applicantList[index]['mobileNumber']
  //         console.log("this applicant mobile number", this.mobileNo)
  //       }
  //       else {
  //         alert("applicant for respective lead not found")
  //         console.log("applicant id mismatched")
  //       }

  //     }
  //   });
  // }

  sendOtp() {
    this.otpForm.patchValue({
      otp: '',
    });
    // this.getApplicantList()
    // console.log("mob no", this.mobileNo)
    const data = {
      applicantId: this.applicantId,
      userId: this.userId,
    };

    this.otpService.sendOtp(data).subscribe((res: any) => {
      console.log('in sendotp', res);
      if (
        res['ProcessVariables']['error']['code'] == '0' &&
        res['ProcessVariables'].referenceNo != ''
      ) {
        console.log(res.ProcessVariables);
        this.referenceNo = res.ProcessVariables.referenceNo;
        this.mobileNo = res.ProcessVariables.mobileNo;
        console.log('reference number ==>', this.referenceNo);
        console.log('mobile number ==>', this.mobileNo);
        this.toasterService.showSuccess('OTP sent successfully !', '');

      }
      else {
        // alert(res.ProcessVariables.error.message);
        this.toasterService.showError(res.ProcessVariables.error.message,'')
      }
    });
  }

  validateOtp() {
    console.log('in validate otp fn', this.otpForm.value.otp, this.referenceNo);

    const data = {
      applicantId: this.applicantId,
      referenceNo: this.referenceNo,
      otp: this.otpForm.value.otp,
    };

    this.otpService.validateOtp(data).subscribe((res: any) => {
      if (res['ProcessVariables']['error']['code'] == '0') {
        console.log(res.ProcessVariables.error);
        this.toasterService.showSuccess('OTP Verified Successfully !', '');
        // alert("otp verified successfully")

        if (res.ProcessVariables.leadStage == '20') {
          this.router.navigate([
            'pages/sales/' + this.leadId + '/applicant-list',
          ]);
        } else {
          this.router.navigate([
            'pages/lead-section/' + this.leadId + '/applicant-details',
          ]);
        }
      } else {
        // alert(res.ProcessVariables.error.message);
        this.toasterService.showError('Invalid OTP !', '');
      }
    });
  }
}
