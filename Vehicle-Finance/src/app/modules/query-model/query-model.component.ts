import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocRequest } from '@model/upload-model';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SearchPipe } from '../../services/search.pipe';
import { Constant } from '@assets/constants/constant';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { QueryModelService } from '@services/query-model.service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';

import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css'],
  providers: [DatePipe]
})
export class QueryModelComponent implements OnInit {
  showModal: boolean;
  selectedDocDetails;
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
  dropDown: boolean;
  searchLead: any = []
  chatMessages: any = [];

  isLeadShow: boolean;
  getSearchableLead: any = []
  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;
  docsDetails: DocRequest;

  fileSize: string;
  imageUrl: string;
  fileName: string;
  fileType: string;

  searchText: any = '';
  searchLeadId: any = '';

  queryLeads: any = [];

  constructor(private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService, private commonLovService: CommomLovService, private router: Router,
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
    console.log(this.leadDetails, 'this.leadDetails')

    this.activatedRoute.params.subscribe((value) => {
      this.leadId = value.leadId;
      console.log('leadId', this.leadId);
    });

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
      "chatPerPage": 100,
      "chatCurrentPage": null,
      "chatSearchKey": searchKey ? searchKey : '',
      "searchKey": searchKey ? searchKey : ''
    }

    this.queryModelService.getLeads(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.chatList = res.ProcessVariables.chatLeads ? res.ProcessVariables.chatLeads : [];
        this.queryLeads = res.ProcessVariables.queryLeads ? res.ProcessVariables.queryLeads : [];
        console.log('Lwasds', this.chatList)
      } else {
        this.chatList = []
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Leads')
      }
    })

  }

  getUsers() {
    let data = {
      "userId": this.userId,
      "leadId": this.queryModalForm.value.leadId
    }

    this.queryModelService.getUsers(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        console.log(res, 'res')
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

  backFromQuery() {
    const currentUrl = localStorage.getItem('currentUrl');
    this.router.navigateByUrl(currentUrl);
  }


  getQueries(lead) {
    console.log('this.leadId', lead)
    let data = {
      "leadId": Number(lead.key),
      "perPage": 100,
      "currentPage": 1,
      "fromUser": this.userId
    }
    this.queryModalForm.patchValue({
      leadId: Number(lead.key),
    })
    this.getUsers()
    console.log(this.queryModalForm, 'model')
    this.queryModelService.getQueries(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.chatMessages = res.ProcessVariables.assetQueries ? res.ProcessVariables.assetQueries : [];

        this.chatMessages.filter((val) => {
          val.time = this.myDateParser(val.createdOn)
        })
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Queries')
      }
    })

  }

  myDateParser(dateStr: string): string {

    let date = dateStr.substring(0, 10);
    let time = dateStr.substring(11, 16);
    let millisecond = dateStr.substring(17, 19)

    let validDate = date + 'T' + time + ':' + millisecond;
    return validDate
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
  }

  getleadIdvalue(value: string) {
    this.isLeadShow = (value === '') ? false : true;

    this.getSearchableLead = this.queryLeads.filter(e => {
      value = value.toString().toLowerCase();
      const eName = e.key.toString().toLowerCase();
      if (eName.includes(value)) {
        return e;
      }
      this.isLeadShow = true;
    });
  }

  getLead(lead) {
    this.isLeadShow = false;
    this.queryModalForm.patchValue({
      leadId: Number(lead.key)
    })
    this.searchLeadId = lead.value;
    this.getUsers()
  }

  getQueryTo(item) {
    this.dropDown = false;
    this.queryModalForm.patchValue({
      queryTo: item.key
    })
    this.searchText = item.value;
  }

  mouseEnter() {
    this.dropDown = true;
    this.isLeadShow = false;
    this.searchLead = this.queryModelLov.queryTo;
  }

  mouseLeave() {
    this.dropDown = false;
    this.isLeadShow = false;
  }

  mouseLeaveLeadId() {
    this.dropDown = false;
    this.isLeadShow = false;
  }

  mouseleadIdEnter() {
    this.getSearchableLead = this.queryLeads;
    this.isLeadShow = true;
    this.dropDown = false;
  }

  onFormSubmit(form) {

    if (form.valid) {

      let assetQueries = [];
      assetQueries.push(form.value)

      let data = {
        "leadId": Number(form.value.leadId),
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

  private bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return 'n/a';
    }
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) {
      return bytes + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }

  async onFileSelect(event) {
    const files: File = event.target.files[0];
    if (!files.type) {
      const type = files.name.split('.')[1];
      this.fileType = this.getFileType(type);
    } else {
      this.fileType = this.getFileType(files.type);
    }
    if (this.checkFileType(this.fileType)) {
      // this.showError = `Only files with following extensions are allowed: ${this.docsDetails.docsType}`;
      return;
    }
    if (this.checkFileSize(files.size)) {
      // this.showError = `File is too large. Allowed maximum size is ${this.bytesToSize(
      //   this.docsDetails.docSize
      // )}`;
      return;
    }

    const base64: any = await this.toBase64(event);
    this.imageUrl = base64;
    this.fileSize = this.bytesToSize(files.size);
    this.fileName = files.name;
  }

  checkFileSize(fileSize: number) {
    if (fileSize > this.docsDetails.docSize) {
      return true;
    }
    return false;
  }

  checkFileType(fileType: string = '') {
    let isThere = false;
    fileType.split('/').forEach((type) => {
      if (this.docsDetails.docsType.includes(type.toLowerCase())) {
        isThere = true;
      }
    });

    return !isThere;
  }

  getFileType(type: string) {
    const types = {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'image/tiff': 'tiff',
      'application/pdf': 'pdf',
      'image/png': 'png',
      'image/jpeg': 'jpeg',
      'application/msword': 'docx'
    };
    return types[type] || type;
  }

  toBase64(evt) {
    return new Promise((resolve, reject) => {
      var f = evt.target.files[0]; // FileList object
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
          var binaryData = e.target.result;
          //Converting Binary Data to base 64
          var base64String = window.btoa(binaryData);
          console.log('base64String', base64String);
          resolve(base64String)
          //showing file converted to base64
          // document.getElementById('base64').value = base64String;
          // alert('File converted to base64 successfuly!\nCheck in Textarea');
        };
      })(f);
      // Read in the image file as a data URL.
      reader.readAsBinaryString(f);
    });
  }

  uploadDocs(index) {
    
 }

  onUploadSuccess(event) {
    this.showModal = false;
    this.toasterService.showSuccess('Document uploaded successfully', '');
    console.log('onUploadSuccess', event);
  }

  chooseFile() {
    this.showModal = true;
    const docNm = 'ACCOUNT_OPENING_FORM';
    const docCtgryCd = 70;
    const docTp = 'LEAD';
    const docSbCtgry = 'ACCOUNT OPENING FORM';
    const docCatg = 'KYC - I';
    const docCmnts = 'Addition of document for Lead Creation';
    const docTypCd = 276;
    const docSbCtgryCd = 204;

    this.selectedDocDetails = {
        docSize: 2097152,
        docsType: Constant.OTHER_DOCUMENTS_ALLOWED_TYPES,
        docNm,
        docCtgryCd,
        docTp,
        docSbCtgry,
        docCatg,
        docCmnts,
        docTypCd,
        docSbCtgryCd,
        docRefId: [
            {
              idTp: 'LEDID',
              id: this.leadId,
            },
            {
              idTp: 'BRNCH',
              id: Number(localStorage.getItem('branchId')),
            },
          ],
    };
  }

}
