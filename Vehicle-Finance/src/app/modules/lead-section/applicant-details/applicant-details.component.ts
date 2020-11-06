import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { LovDataService } from '@services/lov-data.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantList } from '@model/applicant.model';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css'],
})
export class ApplicantDetailsComponent implements OnInit {
  labels: any = {};
  applicantDetails = [];
  isAlert: boolean = true;
  values: any;
  applicantList: ApplicantList[] = [];
  p = 1;
  selectedApplicant: number;
  index: number;
  leadId: number;
  showNotApplicant: boolean;
  isDelete: boolean = false;
  appDetails = [];
  isFemaleForNCV: boolean;
  leadSectioData: any;
  constructor(
    private route: Router,
    private location: Location,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService,
    private lovData: LovDataService,
    private applicantService: ApplicantService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private createLeadDataService: CreateLeadDataService,
    private toasterService: ToasterService
  ) { }

  getLeadId() {
    this.leadSectioData = this.createLeadDataService.getLeadSectionData();
    this.isFemaleForNCV = this.applicantDataStoreService.checkLeadSectionDataForNCV(this.leadSectioData);

    return this.leadSectioData.leadId;
    console.log('Id inside getLead ID', this.leadSectioData.leadId);
  }
  ngOnInit() {
    this.leadId = this.getLeadId();

    const currentUrl = this.location.path();

    console.log('currentUrl', currentUrl);

    // this.activatedRoute.params.subscribe((value) => {
    //  console.log(this.activatedRoute.snapshot.params['leadId']);
    // });

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        console.log('test', this.labels);
      },
      (error) => {
        console.log(error);
      }
    );
    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res, 'res');
      this.values = res[0].addApplicant[0];
      console.log(this.values, 'values');
      this.values.entity = res[0].addApplicant[0].entity;
      console.log('value Entity', this.values.entity);
    });
    // this.getData();
    this.getApplicantList();
    this.applicantDataStoreService.setDedupeFlag(false);
    this.applicantDataStoreService.setPanValidate(false);
    this.applicantDataStoreService.setDetectvalueChange(false)
  }

  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };
    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      //console.log('Applicantlist', value);
      const processVariables = value.ProcessVariables;
      //console.log('ProcessVariables', processVariables);
      this.applicantList = processVariables.applicantListForLead;
      console.log('applicantList', this.applicantList);
      const checkProduct: string = this.leadSectioData.leadDetails.productCatCode;
      if (checkProduct === 'NCV') {
        this.applicantList.map((data: any) => {
          if (data.gender !== '2GENDER') {
            this.isFemaleForNCV = true;
            this.applicantDataStoreService.checkLeadSectionDataForNCV(this.leadSectioData, this.isFemaleForNCV);
          } else {
            this.isFemaleForNCV = false;
            this.applicantDataStoreService.checkLeadSectionDataForNCV(this.leadSectioData, this.isFemaleForNCV);
            return;
          }
        });
      }

      // for(var i=0; i<=this.applicantList.length; i++){
      //   const mobile= this.applicantList[i].mobileNumber;
      //   if(this.applicantList[i].entityTypeKey=='INDIVENTTYP' && mobile.length==12){
      //     this.applicantList[i].mobileNumber= mobile.slice(2,12)
      //   }
      // }
      // for(var i=0; i<=this.applicantList.length; i++){
      //   const companyPhoneNumber= this.applicantList[i].companyPhoneNumber;
      //   if(this.applicantList[i].entityTypeKey=='NONINDIVENTTYP' && companyPhoneNumber.length==12){
      //     this.applicantList[i].companyPhoneNumber= companyPhoneNumber.slice(2,12)
      //   }
      // }
      if (this.applicantList) {
        this.isDelete = this.applicantList.length === 1 ? true : false;
        this.applicantList.map((data) => {
          if (data.mobileNumber && data.mobileNumber.length === 12) {
            data.mobileNumber = data.mobileNumber.slice(2, 12)
          }
          if (data.companyPhoneNumber && data.companyPhoneNumber.length === 12) {
            data.companyPhoneNumber = data.companyPhoneNumber.slice(2, 12)
          }
          return data;
        })
      }


    });
  }
  navigateAddApplicant() {
    console.log('applicant list', this.applicantList)
    //this.findAddressType();
    if (this.applicantList) {
      if (this.applicantList.length > 4) {
        this.toasterService.showWarning('Maximum 5 Applicants', '')
        return;
      }
    }


    this.route.navigateByUrl(`/pages/lead-section/${this.leadId}/co-applicant`);
    // if (this.applicantList.length > 0) {
    //   this.applicantList.filter((val: any) => {
    //     this.applicantDataStoreService.setApplicantRelation(val['applicantType'])
    //   })
    // }
  }



  onSubmit() {
    this.isAlert = false;
    setTimeout(() => {
      this.isAlert = true;
    }, 1500);
  }
  onChange() {
    this.route.navigateByUrl('pages/lead-section/co-applicant');
  }

  editApplicant(index: number) {
    console.log('applicant list', this.applicantList)
    console.log(index);
    this.route.navigateByUrl(
      `pages/lead-section/${this.leadId}/co-applicant/${index}`
    );
  }

  deleteApplicant(index: number) {
    console.log(index);
    this.leadStoreService.deleteApplicant(index);
  }

  softDeleteApplicant(index: number, applicantId: number) {
    const findIndex = this.p === 1 ? index : (this.p - 1) * 5 + index;
    this.index = findIndex;
    this.selectedApplicant = applicantId;


  }

  callDeleteApplicant() {
    const data = {
      applicantId: this.selectedApplicant,
    };
    this.applicantService.softDeleteApplicant(data).subscribe((res) => {
      console.log('res', this.selectedApplicant);
      this.applicantList.splice(this.index, 1);
      console.log('this.apploicantlist', this.applicantList.length)

      this.isDelete = this.applicantList.length === 1 ? true : false;

    });
  }

  forFindingApplicantType() {
    if (this.applicantList) {
      const findApplicant = this.applicantList.find((data) => data.applicantTypeKey == "APPAPPRELLEAD")
      console.log('findApplicant', findApplicant)
      this.showNotApplicant = findApplicant == undefined ? true : false;
    } else {
      this.showNotApplicant = true;
    }

  }

  onNext() {
    // [routerLink]="['../vehicle-details']"
    this.forFindingApplicantType()
    if (this.showNotApplicant) {
      this.toasterService.showError('There should be one applicant for this lead', '')
      return;
    }
   
    const result = this.applicantDataStoreService.checkLeadSectionDataForNCV(this.leadSectioData);
    if (result) {
        this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
    }

    this.route.navigateByUrl(`pages/lead-section/${this.leadId}/vehicle-list`)
  }

  onBack() {
    //this.location.back();
    this.route.navigateByUrl(`pages/lead-section/${this.leadId}`)
  }
}
