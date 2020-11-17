import { DatePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocRequest } from '@model/upload-model';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { Constant } from '@assets/constants/constant';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { QueryModelService } from '@services/query-model.service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';

import { ToasterService } from '@services/toaster.service';
import { Base64StorageService } from '@services/base64-storage.service';
import { CreateLeadService } from '@modules/lead-creation/service/creatLead.service';
import { DraggableContainerService } from '@services/draggable.service';
import { environment } from 'src/environments/environment';
import { PollingService } from '@services/polling.service';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css'],
  providers: [DatePipe]
})
export class QueryModelComponent implements OnInit, OnDestroy {
  showModal: boolean;
  selectedDocDetails;
  queryModalForm: FormGroup;
  queryModelLov: any = {};
  labels: any = {};
  userId: string = '0';

  isShowLeadModal: boolean;

  leadSectionData: any;
  leadId: number = 0;
  chatList: any = [];

  isDirty: boolean;
  dropDown: boolean;
  searchLead: any = []
  chatMessages: any = [];

  isLeadShow: boolean;
  getSearchableLead: any = []
  docsDetails: DocRequest;

  searchText: any = '';
  searchLeadId: any = '';
  searchStakeHolders: any = '';
  searchDocuments: any = '';

  setCss = {
    top: '',
    left: '',
  };

  showDraggableContainer: {
    imageUrl: string;
    imageType: string;
  };

  queryLeads: any = [];
  getLeadsObj: any = {};
  documents: any = [];

  getChatsObj: any = {};

  getLeadSendObj = {
    currentPage: null,
    perPage: 1000,
    searchKey: '',
    chatPerPage: 500,
    chatCurrentPage: null,
    chatSearchKey: ''
  }

  getChatSendObj = {
    leadId: this.leadId,
    perPage: 50,
    currentPage: 1,
    fromUser: this.userId
  }

  conditionalClassArray: any = [];

  routerId: any;
  isMobileView: boolean = false;
  intervalId: any;
  isIntervalStart: boolean = false;

  selectedList: any;
  totalPages: any = 1;
  chatTotalPages: number = 1;

  constructor(private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService, private commonLovService: CommomLovService, private router: Router,
    private labelsData: LabelsService, private uploadService: UploadService, private queryModelService: QueryModelService, private toasterService: ToasterService,
    private utilityService: UtilityService, private draggableContainerService: DraggableContainerService, private base64StorageService: Base64StorageService,
    private createLeadService: CreateLeadService, private activatedRoute: ActivatedRoute, private location: Location, private pollingService: PollingService) { }

  ngOnInit() {

    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
    });

    this.userId = localStorage.getItem('userId');

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.leadId : null;
    })

    this.queryModalForm = this._fb.group({
      searchName: [''],
      queryType: ['', Validators.required],
      query: ['', Validators.required],
      queryFrom: [this.userId, Validators.required],
      queryTo: ['', Validators.required],
      docId: [''],
      docName: [''],
      leadId: ['', Validators.required]
    })

    this.getLov();
    if (environment.isMobile === true) { // 768px portrait
      this.isMobileView = true;
      document.getElementById("mySidenav").style.visibility = "visible";
    }

    const currentUrl = this.location.path();

    setTimeout(() => {
      if (currentUrl.includes('query-model') && this.isIntervalStart) {
        this.intervalId = this.getPollLeads(this.getLeadSendObj)
      } else {
        clearInterval(this.intervalId)
      }
    }, 300000)

  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      let LOV = value.LOVS;
      this.queryModelLov.queryType = value.LOVS.queryType;
      this.getLeads(this.getLeadSendObj);
    });
  }

  openNav() {
    document.getElementById("mySidenav").style.visibility = "visible";
  }

  closeNav() {
    document.getElementById("mySidenav").style.visibility = "hidden";
  }

  loadMorePage(length, chatSearchKey) {

    if (this.getLeadsObj.chatTotalPages > this.chatTotalPages) {

      this.getLeadSendObj = {
        currentPage: null,
        perPage: 10,
        searchKey: '',
        chatPerPage: length + 10,
        chatCurrentPage: this.chatTotalPages + 1,
        chatSearchKey: chatSearchKey
      }
      this.chatTotalPages = this.getLeadSendObj.chatCurrentPage;
      this.getLeads(this.getLeadSendObj)
    }

  }

  getMoreChat(length, getObj) {
    if (getObj.count > this.getChatSendObj.perPage) {
      this.getChatSendObj = {
        leadId: getObj.leadId,
        perPage: length + 50,
        currentPage: 1 + 1,
        fromUser: getObj.userId
      }

      const getChatLead = this.chatList.filter((val) => {
        return getObj.leadId === Number(val.key)
      })
      console.log(getChatLead, 'getChatLead')
      this.getQueries(getChatLead[0], true)
    }
  }

  getLeads(sendObj, chatSearchKey?: string, searchKey?: string) {

    let data = {
      "userId": this.userId,
      "currentPage": sendObj.currentPage,
      "perPage": sendObj.perPage,
      "searchKey": searchKey,
      "chatPerPage": sendObj.chatPerPage,
      "chatCurrentPage": sendObj.chatCurrentPage,
      "chatSearchKey": chatSearchKey
    }

    this.queryModelService.getLeads(data).subscribe((res: any) => {

      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.getCommonLeadData(res)
        this.getQueries(this.chatList[0])
        this.isIntervalStart = true;
      } else {
        this.chatList = [];
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Leads')
      }
    })

  }

  getPollLeads(sendObj) {
    let data = {
      "userId": this.userId,
      "currentPage": sendObj.currentPage,
      "perPage": sendObj.perPage,
      "searchKey": sendObj.searchKey,
      "chatPerPage": sendObj.chatPerPage,
      "chatCurrentPage": sendObj.chatCurrentPage,
      "chatSearchKey": sendObj.chatSearchKey
    }
    return setInterval(() => {
      this.pollingService.getPollingLeadsCount(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.getCommonLeadData(res)
          this.selectedList = this.conditionalClassArray[this.conditionalClassArray.length - 1];
          if (this.selectedList) {
            this.selectedList = this.chatList.find(obj => obj.key === this.selectedList.key)
            this.getQueries(this.selectedList, true)
          } else {
            clearInterval(this.intervalId)
          }
        }
      })
    }, 300000)
  }

  getCommonLeadData(res) {
    this.getLeadsObj = res.ProcessVariables;
    this.chatList = res.ProcessVariables.chatLeads ? res.ProcessVariables.chatLeads : [];
    this.queryLeads = res.ProcessVariables.queryLeads ? res.ProcessVariables.queryLeads : [];

    if (res.ProcessVariables.chatLeads && res.ProcessVariables.chatLeads.length > 0) {

      if (this.routerId && this.queryLeads.length > 0) {
        const test = this.queryLeads.find((val) => {
          return (val.key === this.routerId)
        })

        this.searchLeadId = test ? test.value : '';
        this.queryModalForm.patchValue({
          leadId: Number(this.routerId)
        })

        let index;
        let findChat: any = this.chatList;

        findChat.find((chat, i) => {
          if (chat.key === this.routerId) {
            index = i;
            return chat;
          }
        })
        let spliceChat = findChat.splice(index, 1)
        this.chatList.unshift(spliceChat[0])
      }
    }
    this.queryLeads = res.ProcessVariables.queryLeads ? res.ProcessVariables.queryLeads : [];
  }

  ngOnDestroy() {
    clearInterval(this.intervalId)
  }

  getUsers() {
    let data = {
      "userId": this.userId,
      "leadId": this.queryModalForm.value.leadId
    }

    this.queryModelService.getUsers(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.queryModelLov.queryTo = res.ProcessVariables.stakeholders ? res.ProcessVariables.stakeholders : [];
        this.queryModelLov.filterStackHolders = this.queryModelLov.queryTo;
        this.documents = res.ProcessVariables.documents ? res.ProcessVariables.documents : [];
        this.queryModelLov.documents = this.documents;
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Users')
      }
    })
  }

  backFromQuery() {
    const currentUrl = localStorage.getItem('currentUrl');
    this.router.navigateByUrl(currentUrl);
  }

  getQueries(lead, isSelected?: boolean) {

    if (lead) {
      this.getChatSendObj.leadId = Number(lead.key);
      this.getChatSendObj.fromUser = this.userId;
      let data = this.getChatSendObj;

      this.queryModalForm.patchValue({
        leadId: Number(lead.key),
      })

      if (isSelected) {
        this.conditionalClassArray.push(lead)
      }

      this.selectedList = lead;

      if (this.queryModalForm.value.leadId) {
        this.getLeadSectionData(this.queryModalForm.value.leadId)
      }

      this.searchLeadId = lead.value;
      this.getUsers();
      this.queryModelService.getQueries(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          lead.count = 0;
          if (this.isMobileView) {
            this.closeNav();
          }
          this.getChatsObj = res.ProcessVariables;
          this.chatMessages = res.ProcessVariables.assetQueries ? res.ProcessVariables.assetQueries : [];
          this.chatMessages.filter((val) => {
            val.time = this.myDateParser(val.createdOn)
          })
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Queries')
        }
      })
    }
  }

  getLeadSectionData(leadId) {
    this.createLeadService
      .getLeadById(leadId)
      .subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        this.leadSectionData = response.ProcessVariables;

        if (appiyoError === '0' && apiError === '0') {
          this.leadId = this.leadSectionData.leadId;
          this.createLeadDataService.setLeadSectionData(
            this.leadSectionData
          );
        } else {
          const message = response.ProcessVariables.error.message;
          this.toasterService.showError(message, 'Lead Creation');
        }
      });
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

  getvalueCheck(val: string) {
    this.queryModelLov.filterStackHolders = this.queryModelLov.queryTo.filter(e => {
      val = val.toString().toLowerCase();
      const eName = e.value.toString().toLowerCase();
      if (eName.includes(val)) {
        return e;
      }
    });
  }

  getleadIdvalue(value: string) {
    this.isLeadShow = (value === '') ? false : true;

    this.getSearchableLead = this.queryLeads.filter(e => {
      value = value.toString().toLowerCase();
      const eName = e.value.toString().toLowerCase();
      if (eName.includes(value)) {
        return e;
      }
      this.isLeadShow = true;
    });
  }

  getDocuments(searchValue: string) {

    this.queryModelLov.documents = this.documents.filter(e => {
      searchValue = searchValue.toString().toLowerCase();
      if (e.docId) {
        const eName = e.docId.toString().toLowerCase();
        if (eName.includes(searchValue)) {
          return e;
        } else if (e.docName) {
          const eValName = e.docName.toString().toLowerCase();
          if (eValName.includes(searchValue)) {
            return e;
          }
        }
      }
    });
  }

  getLead(lead) {
    this.isLeadShow = false;
    this.queryModalForm.patchValue({
      leadId: Number(lead.key)
    })
    if (this.queryModalForm.value.leadId) {
      this.getLeadSectionData(this.queryModalForm.value.leadId)
    }
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
    // this.dropDown = true;
    this.searchLead = this.queryModelLov.queryTo;
  }

  mouseLeave() {
    this.dropDown = false;
  }

  mouseLeaveLeadId() {
    this.isLeadShow = false;
  }

  mouseleadIdEnter() {
    this.getSearchableLead = this.queryLeads;
    // this.isLeadShow = true;
  }

  onFormSubmit(form) {

    if (form.valid && form.controls['query'].value.trim().length !== 0) {

      let assetQueries = [];
      // assetQueries.push(form.value)

      assetQueries = [
        {
          query: form.value.query.trim(),
          queryType: form.value.queryType,
          queryFrom: this.userId,
          queryTo: form.value.queryTo,
          docId: form.value.docId,
          docName:  form.value.docName
        }
      ]

      let data = {
        "leadId": Number(form.value.leadId),
        "assetQueries": assetQueries
      }

      this.queryModelService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.getLeads(this.getLeadSendObj);
          form.reset();
          this.queryModalForm.patchValue({
            queryFrom: localStorage.getItem('userId')
          })
          this.searchText = '';
          // this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Query Model Save/Update')
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

  onUploadSuccess(event) {
    this.showModal = false;
    this.toasterService.showSuccess('Document uploaded successfully', '');
    this.docsDetails = event;
    this.queryModalForm.patchValue({
      docId: event.dmsDocumentId ? event.dmsDocumentId : '',
      docName: event.fileName ? event.fileName : ''
    })
  }

  chooseFile() {

    if (this.queryModalForm.value.leadId) {

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
            id: this.queryModalForm.value.leadId,
          },
          {
            idTp: 'BRNCH',
            id: Number(localStorage.getItem('branchId')),
          },
        ],
      };
    } else {
      this.showModal = false;
      this.toasterService.showWarning('Please Select Lead Id', 'Lead Id')
    }

  }

  async downloadDocs(documentId: string, index: number, event) {
    let el = event.srcElement;

    if (!documentId) {
      return;
    }

    let collateralId = this.leadSectionData['vehicleCollateral'] ? this.leadSectionData['vehicleCollateral'][0] : this.leadSectionData['applicantDetails'][0];

    if (!collateralId) {
      return;
    }

    const bas64String = this.base64StorageService.getString(
      collateralId.collateralId + documentId
    );
    if (bas64String) {
      this.setContainerPosition(el);
      this.showDraggableContainer = {
        imageUrl: bas64String.imageUrl,
        imageType: bas64String.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: this.showDraggableContainer,
        css: this.setCss,
      });
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    if (imageValue.imageType.includes('xls')) {
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/vnd.ms-excel');
      return;
    }
    if (imageValue.imageType.includes('doc')) {
      this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/msword');
      return;
    }
    this.setContainerPosition(el);
    this.showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: this.showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(collateralId.collateralId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    });
  }

  getBase64String(documentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(documentId)
        .subscribe((value) => {
          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
            documentName
          });
        });
    });
  }

  setContainerPosition(el) {
    let offsetLeft = 0;
    let offsetTop = 0;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    this.setCss = {
      top: offsetTop + 'px',
      left: offsetLeft + 'px',
    };
  }

  onCustomizerClose() {
    this.isShowLeadModal = false;
  }

  onCustomizerOpen() {
    this.isShowLeadModal = true;
  }

  getDownloadXlsFile(base64: string, fileName: string, type) {
    const contentType = type;
    const blob1 = this.base64ToBlob(base64, contentType);
    const blobUrl1 = URL.createObjectURL(blob1);

    setTimeout(() => {

      const a: any = document.createElement('a');
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = blobUrl1;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(blobUrl1);
    });
  }

  base64ToBlob(b64Data, contentType, sliceSize?: any) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
