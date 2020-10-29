import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { QueryModelService } from '@services/query-model.service';
import { ToasterService } from '@services/toaster.service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css']
})
export class QueryModelComponent implements OnInit {

  queryModalForm: FormGroup;
  queryModelLov: any = {};
  labels: any = {};
  collateralId: number = 1;
  userId: string;

  leadDetails: any;
  leadId: number = 0;
  associatedWith: number = 1;
  chatList: any = [];

  isDirty: boolean;

  terms = '';
  dropDown: boolean;
  searchLead: any = []

  chatMessages: any = [];

  constructor(private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService, private commonLovService: CommomLovService,
    private labelsData: LabelsService, private uploadService: UploadService, private queryModelService: QueryModelService, private toasterService: ToasterService,
    private utilityService: UtilityService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
    });

    this.userId = localStorage.getItem('userId')

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails'];
    let collateralDetails = leadData['vehicleCollateral'];
    this.leadId = Number(this.activatedRoute.snapshot.params['leadId']);

    console.log('coll', this.leadDetails)

    this.queryModalForm = this._fb.group({
      searchName: [''],
      queryType: ['', Validators.required],
      query: ['', Validators.required],
      queryFrom: [this.userId],
      queryTo: ['', Validators.required],
      docId: [''],
      leadId: [this.leadId, Validators.required]
    })

    this.getLov();
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      let LOV = value.LOVS;
      this.queryModelLov.queryType = value.LOVS.queryType;
      this.getUsers();
      this.getLeads();
    });
  }

  getLeads(searchKey?: string) {

    let data = {
      "userId": this.userId,
      "currentPage": null,
      "perPage": 500,
      "searchKey": searchKey ? searchKey : ''
    }

    this.queryModelService.getLeads(this.userId).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.chatList = res.ProcessVariables.leads ? res.ProcessVariables.leads : []
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Leads')
      }
    })
  }

  getUsers() {
    let data = {
      "userId": this.userId,
      "leadId": this.leadId
    }

    this.queryModelService.getUsers(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.queryModelLov.queryTo = res.ProcessVariables.stakeholders ? res.ProcessVariables.stakeholders : []
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Users')
      }
    })
  }

  getDocumentDetails() {
    this.uploadService
      .getDocumentDetails(this.collateralId, this.associatedWith)
      .subscribe((value: any) => { });
  }

  getQueries(lead) {
    let data = {
      "leadId": lead.leadId,
      "perPage": 3,
      "currentPage": 1,
      "fromUser": this.userId
    }
    this.queryModelService.getQueries(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.chatMessages = res.ProcessVariables.assetQueries ? res.ProcessVariables.assetQueries : []
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Queries')
      }

    })
  }

  getvalue(enteredValue: string) {
    this.dropDown = (enteredValue === '') ? false : true;

    this.searchLead = this.queryModelLov.queryTo.filter(e => {
      enteredValue = enteredValue.toString().toLowerCase();
      const eName = e.value.toString().toLowerCase();
      if (eName.includes(enteredValue)) {
        return e;
      }
      this.dropDown = true;
    });
    console.log('e', this.searchLead)
  }

  mouseEnter() {
    this.dropDown = true;
  }

  onFormSubmit(form) {

    console.log('fs', form.controls)

    if (form.valid) {

      let assetQueries = [];
      assetQueries.push(form.value)

      let data = {
        "leadId": this.leadId,
        "assetQueries": assetQueries
      }

      this.queryModelService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          let updateDevision = res.ProcessVariables.updatedDev ? res.ProcessVariables.updatedDev : [];
          this.getLeads()
          this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Query Model Save/Update')
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Query Model Save/Update')
        }
      })

    } else {
      this.isDirty = true;
      this.toasterService.showError('Please enter all mandatory field', 'Query Model Save/Update')
      this.utilityService.validateAllFormFields(form)
    }

  }

}
