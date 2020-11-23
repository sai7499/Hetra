import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { CommonDataService } from '@services/common-data.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  leadId: any;
  isFemaleForNCV: boolean;
  applicantList: any = []

  constructor(
    private applicantDataStoreService: ApplicantDataStoreService,
    private createLeadDataService: CreateLeadDataService,
    private commonDataService: CommonDataService,
    private toasterService: ToasterService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as string;
    this.applicantList = this.applicantDataStoreService.getApplicantList();
    // const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
    // const product = leadSectioData.leadDetails.productCatCode;
    // const applicantDetailsFromPool = leadSectioData.applicantDetails;
    // this.commonDataService.applicantDeleted$.subscribe(data => {
    //   const result = data.bool;
    //   if (result) {
    //     this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(product,data.app);

    //   } else {
    //     this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(product, applicantDetailsFromPool);

    //   }
    // })

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

  onNext() {
    const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
    const product = leadSectioData.leadDetails.productCatCode;

    if (product === 'NCV' || product === 'UCV' || product === 'UC') {
      const showNotCoApplicant= this.applicantDataStoreService.findCoApplicant(this.applicantList)
      if (!showNotCoApplicant) {
         this.toasterService.showInfo('There should be one Co-Applicant for this lead', '')
      }
    }

    if (product === "NCV") {
      const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
      if (!result) {
        this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
      }
    }
    this.route.navigate([`pages/sales/${this.leadId}/reference`]);
  }

}
