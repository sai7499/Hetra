import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { CommonDataService } from '@services/common-data.service';
import { ToasterService } from '@services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';

@Component({
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
    public label: any = {};
    leadId: number;
    applicantList: any = []

    public colleteralArray = [
        {
            colleteralType: 'Colleteral Type-1',
            column2: '',
            column3: ''
        },
        {
            colleteralType: 'Colleteral Type-2',
            column2: '',
            column3: ''
        }
    ]

    constructor(private labelsData: LabelsService,
        private createLeadDataService: CreateLeadDataService,
        private commonDataService: CommonDataService,
        private toasterService: ToasterService,
        private route: Router,
        private activatedRoute: ActivatedRoute,
        private applicantDataStoreService: ApplicantDataStoreService) { }

    ngOnInit() {
        this.labelsData.getLabelsOfDDEData()
            .subscribe(data => {
                this.label = data.vehicleDetailsTable[0];
            }, error => {
                console.log('error')
            });

        let leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = leadData['leadId'];
        this.applicantList = this.applicantDataStoreService.getApplicantList();
    }

    onNext() {
        const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
        const product = leadSectioData.leadDetails.productCatCode;
    
        if (product === "NCV") {
          const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
          if (!result) {
            this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
          }
        }
        this.route.navigate([`pages/dde/${this.leadId}/reference`]);
      }
}
