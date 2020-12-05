import { DatePipe, Location } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class QueryModelComponent implements OnInit, OnDestroy, AfterContentChecked, DoCheck {

  @ViewChild('scrollMe', { static: true }) el: ElementRef;
  scrolltop: number = null;

  showModal: boolean = false;
  selectedDocDetails;
  queryModalForm: FormGroup;
  queryModelLov: any = {};
  labels: any = {};
  userId: string = '0';

  isShowLeadModal: boolean;
  clickedIndex: any = null;
  isClickDropDown: any;
  isClickButton: any;

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

  LOV: any;
  initalQueryStatus: any = []

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

  isleadIdshowError: boolean = false;
  leadIdDeductValue: boolean = false;

  isQueryToShowError: boolean = false;
  queryToDeductValue: boolean = false;

  // Reply To
  isReplyToArray: any = [];
  replySearchArray: any = [];
  replyDropdown: boolean;
  getDisableQueryTo: any;
  searchQueryId: any = '';
  searchChatMessages: any = [];

  constructor(private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService, private commonLovService: CommomLovService, private router: Router,
    private labelsData: LabelsService, private uploadService: UploadService, private queryModelService: QueryModelService, private toasterService: ToasterService,
    private utilityService: UtilityService, private draggableContainerService: DraggableContainerService, private base64StorageService: Base64StorageService,
    private createLeadService: CreateLeadService, private activatedRoute: ActivatedRoute, private location: Location, private pollingService: PollingService,
    private changeDetector: ChangeDetectorRef) { }

  async ngOnInit() {

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
      searchLeadId: ['', Validators.required],
      searchText: ['', Validators.required],
      docName: [''],
      repliedTo: [null],
      queryStatus: ['OPNQUESTAT'],
      leadId: ['', Validators.required]
    })

    this.getLov();

    const gotLeadData = this.activatedRoute.snapshot.data.data;
    if (gotLeadData.Error === '0') {
      const leadData = gotLeadData.ProcessVariables;
      this.getCommonLeadData(gotLeadData)
      this.isIntervalStart = true;
    }

    if (environment.isMobile === true) { // 768px portrait
      this.isMobileView = true;
      document.getElementById("mySidenav").style.visibility = "visible";
    }

    const currentUrl = this.location.path();

    try {
      // await this.getLeads(this.getLeadSendObj);
      if (currentUrl.includes('query-model') && this.isIntervalStart) {
        this.intervalId = this.getPollLeads(this.getLeadSendObj)
      }
    } catch (error) {

    }
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }

  ngDoCheck() {
    this.changeDetector.detectChanges();
    // this.scrollToBottom();
  }

  isCheckFropdownBut(chat, index) {

    if (this.isClickDropDown === index) {
      this.clickedIndex = null;
    } else {
      this.isClickDropDown = null;
      this.clickedIndex === index ? this.clickedIndex = null : this.clickedIndex = index
    }

  }

  openOptionDropDown(index) {
    this.isClickDropDown = index;
    this.clickedIndex = null;
    // document.getElementById("chat-box").style.overflowY = "hidden";
  }

  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      this.LOV = value.LOVS;
      this.queryModelLov.queryStatus = value.LOVS.queryStatus;
      this.queryModelLov.queryType = value.LOVS.queryType;

      this.initalQueryStatus = [{
        key: 'OPNQUESTAT',
        value: 'Opened'
      }]
      this.queryModelLov.queryStatus = this.initalQueryStatus;
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
      this.getQueries(getChatLead[0], true)
    }
  }

  scrollToBottom() {

    let div = document.getElementById('chat-box');

    const el: HTMLDivElement = this.el.nativeElement;
    // let height = pbox.scrollTop() + pbox.height() + $('#postbox').filter('.chat_msg:last').scrollTop();
    div.scrollTop = div.scrollHeight - div.offsetHeight;
    this.scrolltop = Math.max(0, el.scrollHeight - el.offsetHeight)

    // div.scrollTo(0, document.getElementById('chat-box').scrollHeight)
  }

  async getLeads(sendObj, chatSearchKey?: string, searchKey?: string) {

    let data = {
      "userId": this.userId,
      "currentPage": sendObj.currentPage,
      "perPage": sendObj.perPage,
      "searchKey": searchKey,
      "chatPerPage": sendObj.chatPerPage,
      "chatCurrentPage": sendObj.chatCurrentPage,
      "chatSearchKey": chatSearchKey
    }

    return new Promise((resolve, reject) => {
      this.queryModelService.getLeads(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.getCommonLeadData(res)
          this.isIntervalStart = true;
          resolve()
        } else {
          this.chatList = [];
          reject()
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Leads')
        }
      })
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
          // this.selectedList = this.conditionalClassArray[this.conditionalClassArray.length - 1];
          // if (this.selectedList) {
          //   this.selectedList = this.chatList.find(obj => obj.key === this.selectedList.key)
          //   this.getQueries(this.selectedList, true)
          // }
        } else {
          clearInterval(this.intervalId)
        }
      })
    }, 600000)
  }

  getCommonLeadData(res) {
    this.getLeadsObj = res.ProcessVariables;
    this.chatList = res.ProcessVariables.chatLeads ? res.ProcessVariables.chatLeads : [];
    this.queryLeads = res.ProcessVariables.queryLeads ? res.ProcessVariables.queryLeads : [];

    if (this.routerId && this.queryLeads.length > 0) {

      const test = this.queryLeads.find((val) => {
        return (val.key === this.routerId)
      })

      this.queryModalForm.patchValue({
        searchLeadId: test ? test.value : '',
        leadId: Number(this.routerId)
      })

      this.getUsers();

      if (res.ProcessVariables.chatLeads && res.ProcessVariables.chatLeads.length > 0) {
        let index;
        let findChat: any = this.chatList;

        let emptyLeadData = {
          count: 0,
          key: this.routerId,
          value: test ? test.value : '',
        }

        findChat.find((chat, i) => {
          if (chat.key === this.routerId) {
            index = i;
            return chat;
          }
        })

        this.selectedList = findChat;
        let spliceChat = findChat.splice(index, 1)
        this.chatList.unshift(spliceChat[0])

        if (this.chatList[0].key !== this.routerId) {
          this.chatList.unshift(emptyLeadData)
        }
        this.getQueries(this.chatList[0], true)
      }
    } else {
      this.selectedList = this.conditionalClassArray[this.conditionalClassArray.length - 1];

      if (this.selectedList) {
        this.selectedList = this.chatList.find(obj => obj.key === this.selectedList.key)
        this.getQueries(this.selectedList, true)
      } else {
        this.getQueries(this.chatList[0], true)
      }
      this.isIntervalStart = true;
    }
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
        this.queryModelLov.queryTo = [];
        this.documents = []
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Users')
      }
    })
  }

  backFromQuery() {
    const currentUrl = localStorage.getItem('forQueryUrl');
    this.router.navigateByUrl(currentUrl);
  }

  getQueries(lead, isSelected?: boolean) {

    if (lead) {
      this.getChatSendObj.leadId = Number(lead.key);
      this.getChatSendObj.fromUser = this.userId;
      let data = this.getChatSendObj;

      this.queryModalForm.patchValue({
        leadId: Number(lead.key),
        searchLeadId: lead.value
      })

      if (isSelected) {
        this.conditionalClassArray.push(lead)
      }

      this.selectedList = lead;

      if (this.queryModalForm.value.leadId) {
        this.getLeadSectionData(this.queryModalForm.value.leadId)
      }

      this.getUsers();
      this.queryModelService.getQueries(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          if (this.isMobileView) {
            this.closeNav();
          }
          this.getChatsObj = res.ProcessVariables;
          this.chatMessages = res.ProcessVariables.assetQueries ? res.ProcessVariables.assetQueries : [];
          this.searchChatMessages = this.chatMessages;
          this.isReplyToArray = this.chatMessages.filter((val, i) => {
            val.time = this.myDateParser(val.createdOn)
            return {
              queryId: val.queryId,
              status: val.queryStatus,
              queryTo: val.queryTo
            }
          })
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Queries')
        }
      })
    }
  }

  clearSearch() {
    this.searchQueryId = '';
    this.searchChatMessages = this.chatMessages;
  }

  getLeadSectionData(leadId) {
    this.createLeadService
      .getLeadById(leadId)
      .subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
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

  getleadIdvalue(value: string) {

    if (value && value.length > 0) {
      this.leadIdDeductValue = true;
    }

    this.isLeadShow = (value === '') ? false : true;
    if (value.length >= 3) {
      this.getSearchableLead = this.queryLeads.filter(e => {
        value = value.toString().toLowerCase();
        const eName = e.value.toString().toLowerCase();
        if (eName.includes(value)) {
          return e;
        }
        this.leadIdDeductValue = true;
        this.isLeadShow = true;
      });
    } else {
      this.isLeadShow = false;
    }
  }

  onBlurleadId() {
    if (this.leadIdDeductValue) {
      this.isleadIdshowError = true;
    } else {
      this.isleadIdshowError = false;
    }
  }

  getvalue(enteredValue: string) {

    if (enteredValue && enteredValue.length > 0) {
      this.queryToDeductValue = true;
    }

    if (enteredValue.length >= 3) {
      this.searchLead = this.queryModelLov.queryTo.filter(e => {
        enteredValue = enteredValue.toString().toLowerCase();
        const eName = e.value.toString().toLowerCase();
        if (eName.includes(enteredValue)) {
          this.getDisableQueryTo = e;
          return e;
        }
        this.dropDown = true;
        this.queryToDeductValue = true;
      });
    } else {
      this.dropDown = false;
    }
  }

  searchRepliedTo(value: string) {

    if (value && value.length >= 1) {
      this.replySearchArray = this.isReplyToArray.filter((sea: any) => {
        value = value.toString().toLowerCase();
        const eName = sea.queryId.toString().toLowerCase();
        if (eName.includes(value)) {
          if (sea.queryStatusDesc !== 'Closed') {
            this.replyDropdown = true;
            return sea;
          } else {
            this.toasterService.showInfo('This query alredy closed', '')
          }
        }
      })
    } else {
      this.queryModalForm.patchValue({
        repliedTo: null
      })
      this.replyDropdown = false;
      this.queryModalForm.get('searchText').enable();
      this.queryModalForm.get('queryType').enable();

      this.queryModelLov.queryStatus = this.initalQueryStatus;
    }

  }

  getReplyTo(val) {

    this.replyDropdown = false;
    this.getvalue(val.queryTo);
    this.dropDown = false;
    this.queryModalForm.patchValue({
      query: val.query,
      queryType: val.queryType,
      queryFrom: this.userId,
      searchText: this.getDisableQueryTo.value,
      queryTo: val.key,
      repliedTo: val.queryId,
      queryStatus: val.queryStatus
    })

    this.queryModelLov.queryStatus = this.LOV.queryStatus.filter((status) => {
      if (status.key !== 'OPNQUESTAT') {

        if (val.queryFrom === this.userId) {
          return {
            key: status.key,
            value: status.value
          }
        } else if (status.key !== 'REOPNQUESTAT' && status.key !== 'CLOSEQUESTAT') {
          return {
            key: status.key,
            value: status.value
          }
        }
      }
    })
    this.queryModalForm.get('queryType').disable()
    this.queryModalForm.get('searchText').disable()
  }

  onBlurQueryTo() {
    if (this.queryToDeductValue) {
      this.isQueryToShowError = true;
    } else {
      this.isQueryToShowError = false;
    }
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

  searchQueryIdMessage(val: string) {
    let queryMessage = [];

    let messge;

    this.searchChatMessages = this.chatMessages.filter((mes: any, i) => {
      val = val.toString().toLowerCase();
      if (mes.queryId) {
        const eQueryId = mes.queryId.toString().toLowerCase();
        if (eQueryId.includes(val)
        ) {

          queryMessage = this.chatMessages.filter((res) => {
            if (mes.parentQueryId) {
              if (mes.parentQueryId === res.parentQueryId || mes.parentQueryId === res.queryId) {
                return res;
              }
            } else if (mes.queryId === res.parentQueryId || mes.queryId === res.queryId) {
              return res
            } else {
              mes
            }
          })
          return queryMessage
        }
      }
    })

    this.searchChatMessages = queryMessage;

  }

  getLead(lead) {
    this.isLeadShow = false;
    this.queryModalForm.patchValue({
      leadId: Number(lead.key),
      searchLeadId: lead.value
    })
    if (this.queryModalForm.value.leadId) {
      this.getLeadSectionData(this.queryModalForm.value.leadId)
    }
    this.getUsers()
    this.isleadIdshowError = false;
    this.leadIdDeductValue = true;

  }

  getQueryTo(item) {
    this.dropDown = false;
    this.queryModalForm.patchValue({
      queryTo: item.key,
      searchText: item.value
    })

    this.isQueryToShowError = false;
    this.queryToDeductValue = true;
  }

  mouseEnter() {
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
    if (this.queryModalForm.value.searchLeadId && this.queryModalForm.value.searchLeadId.length >= 3) {
      this.getleadIdvalue(this.queryModalForm.value.searchLeadId)
    }
  }

  onFormSubmit(form) {

    if (this.isleadIdshowError || this.isQueryToShowError) {
      this.toasterService.showError('Please enter all mandatory field', '')
      return;
    }

    if (form.valid && form.controls['query'].value.trim().length !== 0) {

      let assetQueries = [{
        query: form.controls['query'].value.trim(),
        queryType: form.controls['queryType'].value,
        queryFrom: this.userId,
        queryTo: form.controls['queryTo'].value,
        docId: form.controls['docId'].value,
        docName: form.controls['docName'].value,
        repliedTo: form.controls['repliedTo'].value,
        queryStatus: form.controls['queryStatus'].value,
      }]

      let data = {
        "leadId": Number(form.value.leadId),
        "assetQueries": assetQueries
      }

      this.queryModelService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.queryModalForm.patchValue({
            queryFrom: localStorage.getItem('userId'),
            query: ' ',
            docId: '',
            docName: ''
          })
          this.queryModalForm.get('queryType').enable()
          this.queryModalForm.get('searchText').enable()
          this.queryModalForm.get('repliedTo').enable()
          this.queryModalForm.get('queryTo').enable()

          const test = this.queryLeads.find((val) => {
            return (val.key === this.routerId)
          })

          // this.queryModalForm.patchValue({
          //   searchLeadId: test ? test.value : '',
          //   leadId: Number(form.value.leadId)
          // })

          // let emptyLeadData = {
          //   key: form.value.leadId,
          //   value: test ? test.value : '',
          //   count: 0
          // }

          // this.selectedList = emptyLeadData;
          this.getLeads(this.getLeadSendObj);
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Query Model Save/Update')
        }
      })

    } else {
      this.isDirty = true;
      this.toasterService.showError('Please enter all mandatory field', '')
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

  async downloadAllFiles(documentId: string, index: number, event) {

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
    if (imageValue.imageType.includes('png')) {
      return this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/png');

    }

    if (imageValue.imageType.includes('pdf')) {
      return this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/pdf');

    }

    if (imageValue.imageType.includes('jpeg')) {
      return this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'image/jpeg');
    }

    if (imageValue.imageType.includes('tiff')) {
      return this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'image/tiff');
    }

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

  openOptions(selectedData, i) {
    this.isClickDropDown = null;
    this.clickedIndex = null;
    let queryTo = this.userId === selectedData.queryFrom ? selectedData.queryTo : selectedData.queryFrom;

    this.queryModelLov.queryStatus = this.LOV.queryStatus.filter((status: any) => {

      if (status.key !== 'OPNQUESTAT') {
        if (selectedData.parentQueryId) {

          let data = this.chatMessages.filter((res) => {

            if (selectedData.parentQueryId === res.queryId && res.queryFrom === this.userId) {
              return {
                key: status.key,
                value: status.value
              }
            } else if (status.key !== 'REOPNQUESTAT' && status.key !== 'CLOSEQUESTAT') {
              return {
                key: status.key,
                value: status.value
              }
            }
          })
          return data
        } else if (selectedData.queryFrom === this.userId) {
          return {
            key: status.key,
            value: status.value
          }
        } else if (status.key !== 'REOPNQUESTAT' && status.key !== 'CLOSEQUESTAT') {
          return {
            key: status.key,
            value: status.value
          }
        }
      }
    })

    let fileterData = this.queryModelLov.queryTo.find((res: any) => {
      return res.key === queryTo;
    })

    this.queryModalForm.patchValue({
      queryType: selectedData.queryType,
      queryFrom: this.userId,
      searchText: fileterData.value,
      queryTo: fileterData.key,
      repliedTo: selectedData.queryId,
      queryStatus: ''
    })

    this.queryModalForm.get('queryType').disable()
    this.queryModalForm.get('searchText').disable()

    this.isClickButton = i;
  }

  updateStatus(data) {

    let bodyResponse = {
      "leadId": this.queryModalForm.controls['leadId'].value,
      "queryId": data.queryId,
      "queryStatus": 'CLOSEQUESTAT'
    }

    this.queryModelService.updateQueryStatus(bodyResponse).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        this.getLeads(this.getLeadSendObj);
      }
    })

  }

  autoPopulateQueryType(resVal) {
    console.log(resVal, 'resVal')
    this.queryModalForm.patchValue({
      queryTo: resVal.key,
      searchText: resVal.value
    })
  }

}
