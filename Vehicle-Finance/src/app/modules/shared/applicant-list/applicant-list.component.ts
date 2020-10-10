import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantList } from '@model/applicant.model';
import { LeadStoreService } from '../../sales/services/lead.store.service';
import { ApplicantImageService } from '@services/applicant-image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToasterService } from '@services/toaster.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';


@Component({
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.css'],
})
export class ApplicantListComponent implements OnInit {
  labels: any = {};
  showAddApplicant: boolean;
  applicantUrl: string;
  applicantList: ApplicantList[] = [];
  p = 1;
  index: number;
  selectedApplicantId: number;
  leadId: number;
  imageUrl: any;
  showModal = false;
  backupApplicantId: any;
  cibilImage: any;
  showNotApplicant : boolean;

  constructor(
    private labelsData: LabelsService,
    private location: Location,
    private applicantService: ApplicantService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantImageService: ApplicantImageService,
    private domSanitizer: DomSanitizer,
    private toasterService: ToasterService,
    private createLeadDataService : CreateLeadDataService,
  ) { }

  async ngOnInit() {
    const currentUrl = this.location.path();

    this.isShowAddaApplicant(currentUrl);

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );

    // this.activatedRoute.parent.params.subscribe((value) => {
    //   console.log('parent params', value);
    // });

    this.leadId = (await this.getLeadId()) as number;
    if (currentUrl.includes('sales')) {
      this.applicantUrl = `/pages/sales-applicant-details/${this.leadId}/basic-details`;
    } else {
      this.applicantUrl = `/pages/applicant-details/${this.leadId}/basic-data`;
    }
    this.getApplicantList();
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

  navigateAddapplicant() {


    if (this.applicantList.length > 4) {
      this.toasterService.showWarning('Maximum 5 Applicants', '')
      return;
    }
    this.router.navigateByUrl(`/pages/sales-applicant-details/${this.leadId}/add-applicant`);
  }


  navigatePage(applicantId: string) {
    console.log(
      'applicantId',
      applicantId,
      `${this.applicantUrl}/${applicantId}`
    );
    this.router.navigate([`${this.applicantUrl}/${applicantId}`]);
  }

  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      this.applicantList = processVariables.applicantListForLead;
      console.log('getapplicants', this.applicantList);
    });
  }

  isShowAddaApplicant(currentUrl: string) {
    this.showAddApplicant = !currentUrl.includes('dde');
  }
  onApplicantClick(item) { }

  softDeleteApplicant(index: number, applicantId: number) {
    const findIndex = this.p === 1 ? index : (this.p - 1) * 5 + index;
    this.index = findIndex;
    this.selectedApplicantId = applicantId;

    // const data = {
    //   applicantId,
    // };
    // this.applicantService.softDeleteApplicant(data).subscribe((res) => {
    //   console.log('res', applicantId);
    //   this.applicantList.splice(findIndex, 1);
    // });
  }

  callDeleteApplicant() {
    const data = {
      applicantId: this.selectedApplicantId,
    };
    this.applicantService.softDeleteApplicant(data).subscribe((res) => {
      console.log('res', this.selectedApplicantId);
      this.applicantList.splice(this.index, 1);
    });
  }

  getApplicantImage(applicantID: any) {

    // tslint:disable-next-line: triple-equals
    if (this.backupApplicantId == applicantID) {
      this.cibilImage = this.imageUrl;
      return;
    } else {
      const body = {
        applicantId: applicantID
      };
      this.backupApplicantId = applicantID;
      this.applicantImageService.getApplicantImageDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res.ProcessVariables.error.code == '0') {
          const imageUrl = res.ProcessVariables.response;
          this.imageUrl = imageUrl;
          this.imageUrl = atob(this.imageUrl); // decoding base64 string to get xml file
          this.imageUrl = this.domSanitizer.bypassSecurityTrustHtml(this.imageUrl); // sanitizing xml doc for rendering with proper css
          this.cibilImage = this.imageUrl;
        } else {
          this.imageUrl = res.ProcessVariables.error.message;
          this.cibilImage = res.ProcessVariables.error.message;
        }
      });
    }

  }

  forFindingApplicantType(){
    const findApplicant= this.applicantList.find((data)=>data.applicantTypeKey=="APPAPPRELLEAD")
    console.log('findApplicant',findApplicant)
    this.showNotApplicant=findApplicant==undefined? true: false;
   }

  onNext() {

    this.forFindingApplicantType()
    if(this.showNotApplicant){
      this.toasterService.showError('There should be one applicant for this lead','')
      return;
    }
    if(this.router.url.includes('sales')){
      this.router.navigateByUrl(`pages/sales/${this.leadId}/vehicle-list`)
    }else{
      this.router.navigateByUrl(`pages/dde/${this.leadId}/vehicle-list`)
    }
    
  }
  destroyImage() {
    if (this.cibilImage) {
      this.cibilImage = null;
    }
  }

}

//   // routetoEB(){
//   //   // this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-kyc-details`);
//   // }
// }
