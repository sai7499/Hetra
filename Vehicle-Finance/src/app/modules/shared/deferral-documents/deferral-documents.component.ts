import { Component, OnInit, HostListener,  ViewChild,
  ElementRef, } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from "@services/labels.service";
import { UtilityService } from '@services/utility.service';
import { DeferralDocService } from '@services/deferral-doc.service';
import { UploadService } from '@services/upload.service';
import { Constant } from '@assets/constants/constant';
import { ToasterService } from '@services/toaster.service';
import { DraggableContainerService } from '@services/draggable.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { SharedService } from '../shared-service/shared-service';

@Component({
  selector: 'app-deferral-documents',
  templateUrl: './deferral-documents.component.html',
  styleUrls: ['./deferral-documents.component.css']
})
export class DeferralDocumentsComponent implements OnInit {
  deferralForm: FormGroup;
  toDayDate: Date = new Date();
  isLoan360: boolean = false;

  rcvdOn: Date;
  documentArray: any = [];
  selectedDocDetails: {
    docSize: number;
    formArrayIndex: any; 
    docsType: any;
    docNm: any; 
    docCtgryCd: any;
    docTp: string; 
    docSbCtgry: any;
    docCatg: any; 
    docCmnts: string;
    documentId : any;
    docTypCd: any; 
    docSbCtgryCd: any;
    docRefId: { idTp: string; id: any; }[];
  };
  showModal: boolean;
  leadId: any;
  labels: any;
  validationData: any;
  documentDetails: any = [];
  docName: any = [];
  roleIds: any = [];
  apiValue: any[];
  branchUsers: any = [];
  roleIdList: any = [];
  isDirty: boolean;
  isRoleIdCheck = [];
  isAllDocUpload: boolean = false;
  minDefDate : Date = new Date();

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private labelsData: LabelsService,
    private router: Router,
    private utilityService: UtilityService,
    private deferralDocService: DeferralDocService,
    private uploadService: UploadService,
    private toasterService: ToasterService,
    private draggableContainerService: DraggableContainerService,
    private objectComparisonService: ObjectComparisonService,
    private sharedService: SharedService,
  ) {
    var date = this.toDayDate.getDate()
    var month = this.toDayDate.getMonth()
    var year = this.toDayDate.getFullYear()
    var hour = this.toDayDate.getHours()
    var minute = this.toDayDate.getMinutes()
    this.rcvdOn = new Date(year, month, date, hour, minute)
    this.minDefDate.setDate(this.minDefDate.getDate() +1)
    this.minDefDate = this.utilityService.setTimeForDates(this.minDefDate)
  }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as Number;
    this.getLabels();
    this.initForm();
    this.getDocumentDetails();
  }

  getLeadId() {
    return new Promise((resolve) => {
      this.activatedRoute.params.subscribe((value) => {
        if (!value.leadId) {
          resolve(null)
        }
        resolve(Number(value.leadId))
      })
    })
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  initForm() {
    this.deferralForm = new FormGroup({
      defDocumentArray: new FormArray([])
    })

  }

  // @HostListener('mouseover') onMouseOver(event){
  //   console.log('event', event)
  //   const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
  //   const formValues = formArray.getRawValue();
  //   this.isAllDocUpload = formValues.every((data)=>{
  //     return !!data.dmsDocumentId
  //   })
  // }

  

  getDocumentDetails() {
    this.deferralDocService.getDeferralDocs({ leadId: this.leadId }).subscribe((res) => {
      const processvariable = res['ProcessVariables'];
      if (processvariable.error.code == '0') {
        console.log('processvariable', processvariable)
        this.documentDetails = processvariable.documentDetails || [];
      
        this.branchUsers = processvariable.branchUsers || []
        this.documentDetails.map((data) => {
          const docNames = {
            key: data.documentType,
            value: data.documentTypeValue
          }
          const roleIds = {
            key : data.documentRoleId,
            value : data.documentRoleName
          }
          this.docName.push(docNames);
          this.roleIds.push(roleIds)
        })
        setTimeout(() => {
          this.initRows(this.documentDetails)
        })

      } else {
        this.toasterService.showError(processvariable.error.message, '')
      }
    })
  }

  initRows(data) {
    if (!data) {
      return;
    }
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    data.forEach((element) => {
      const formGroup = new FormGroup({
        documentType: new FormControl(element.documentType || ''),
        deferredDate: new FormControl(this.utilityService.getDateFromString(element.deferredDate) || ''),
        receivedBy: new FormControl(element.receivedBy || '',[Validators.required]),
        receivedOn: new FormControl({ value:element.receivedOn ?  this.utilityService.getDateFromString(element.receivedOn) : this.rcvdOn, disabled: true }),

        associatedId: new FormControl(element.associatedId || ''),
        associatedWith: new FormControl(element.associatedWith || ''),
        categoryCode: new FormControl(element.categoryCode || ''),
        categoryCodeValue: new FormControl(element.categoryCodeValue || ''),
        dmsDocumentId: new FormControl(element.dmsDocumentId || ''),
        documentId: new FormControl(element.documentId || ''),
        subCategoryCode: new FormControl(element.subCategoryCode || '')

      });
      formArray.push(formGroup);
    });
    const formValues = formArray.getRawValue();
    formValues.forEach((ele, index)=>{
      if(ele.documentType){
        formArray['controls'][index].get('documentType').disable();
      }
    })

    this.apiValue = formValues;

    // this.isAllDocUpload = formValues.every((data)=>{
    //   return !!data.dmsDocumentId
    // })

    // this.documentArray = data;
  }

  uploadDocs(index) {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const docTypKey = formArray['controls'][index].get('documentType').value;
    const docTyp = this.docName.find((data) => {
      return data.key === docTypKey
    })
    console.log('docTyp', docTyp)
    const docNm = docTyp.value;
    const docCtgryCd = formArray['controls'][index].get('categoryCode').value;
    const docTp = 'LEAD';
    const docSbCtgry = docTyp.value;
    const docCatg = formArray['controls'][index].get('categoryCodeValue').value;
    const docCmnts = 'Addition of document for Lead Creation';
    const docTypCd = docTyp.key;
    const docSbCtgryCd = formArray['controls'][index].get('subCategoryCode').value;
    const documentId = formArray['controls'][index].get('documentId').value;

    this.showModal = true;
    this.selectedDocDetails = {
      docSize: 2097152,
      formArrayIndex: index,
      docsType: Constant.OTHER_DOCUMENTS_ALLOWED_TYPES,
      docNm,
      docCtgryCd,
      docTp,
      documentId,
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


  onUploadSuccess(event) {
    this.showModal = false;
    this.toasterService.showSuccess('Document uploaded successfully', '');
    console.log('onUploadSuccess', event);
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    formArray['controls'][event.formArrayIndex].get('dmsDocumentId').setValue(event.dmsDocumentId);
    let index = 0;
    if (this.documentDetails.length === 0) {
      this.documentDetails.push(event);
      index = 0;
    } else {
      index = this.documentDetails.findIndex((value) => {
        return (
          value.subCategoryCode === event.subCategoryCode &&
          value.documentId === event.documentId
        );
      });
      if (index === -1) {
        this.documentDetails.push(event);
        index = this.documentDetails.length - 1;
      } else {
        this.documentDetails[index] = event;
      }
    }

    console.log('documentDetails', this.documentDetails);
    const formRecdVal = formArray['controls'][event.formArrayIndex].get('receivedOn').value;
    const receivedOn = this.utilityService.convertDateTimeTOUTC(formRecdVal, 'DD/MM/YYYY HH:mm')
    event.isDeferred = "1";
    event.receivedBy = formArray['controls'][event.formArrayIndex].get('receivedBy').value;
    //event.receivedBy= "7";
    event.receivedOn = receivedOn;
    event.deferredDate = 
    this.utilityService.getDateFormat(formArray['controls'][event.formArrayIndex].get('deferredDate').value)
    this.individualImageUpload(event, index);
  }

  individualImageUpload(request, index: number) {
    this.uploadService
      .saveOrUpdateDocument([request])
      .subscribe((value: any) => {  
        const processVariables = value.ProcessVariables;
        if (processVariables.error.code === '0'){
          const documentId = processVariables.documentIds[0];
          //this.documentDetails[index].documentId = documentId;
          const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
          formArray['controls'][index].get('documentId').setValue(documentId);
          this.toasterService.showSuccess('Document uploaded successfully', '');
        }else{
          this.toasterService.showError(processVariables.error.message, '');
        }
        
      });
  }



  documentArr(index) {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const value = formArray['controls'][index].get('dmsDocumentId').value;
    return value;
  }

  async downloadDocs(index) {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const documentId = formArray['controls'][index].get('dmsDocumentId').value;
    
    if (!documentId) {
        return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    if (imageValue.imageType.includes('xls')) {
        console.log('xls', imageValue.imageUrl);
        this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/vnd.ms-excel');
        return;
    }
    if (imageValue.imageType.includes('doc')) {
        console.log('xls', imageValue.imageUrl);
        this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/msword');
        return;
    }
    const showDraggableContainer = {
        imageUrl: imageValue.imageUrl,
        imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
        image: showDraggableContainer
    });
}

getBase64String(documentId) {
    return new Promise((resolve, reject) => {
        this.uploadService
            .getDocumentBase64String(documentId)
            .subscribe((value) => {
                //rslt

                const msgHdr = value['dwnldDocumentRep'].msgHdr;
                if (msgHdr.rslt !== 'OK') {
                    const error = value['dwnldDocumentRep'].msgHdr.error[0];
                    if (error && error.cd === 'BWENGINE-100067') {
                        return this.toasterService.showError('Invalid document number', '');
                    }
                }
                const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
                const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
                const imageType = documentName.split('.')[1].toLowerCase();
                resolve({
                    imageUrl,
                    imageType,
                    documentName
                });
                console.log('downloadDocs', value);
            });
    });
}

getDownloadXlsFile(base64: string, fileName: string, type) {
    const contentType = type;
    const blob1 = this.base64ToBlob(base64, contentType);
    const blobUrl1 = URL.createObjectURL(blob1);
    console.log('blobUrl1', blobUrl1);
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

  onSave() {
    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const formValues = formArray.getRawValue();
    this.isDirty = true;
    this.isRoleIdCheck = []
    console.log('formValues', formValues);
    this.checkRoleId(formValues);
    
    
    //const todayDate = new Date()
    formValues.forEach((data)=>{
      data.deferredDate = this.utilityService.getDateFormat(data.deferredDate),
      data.receivedOn = this.utilityService.convertDateTimeTOUTC(data.receivedOn, 'DD/MM/YYYY HH:mm')
      data.isDeferred = "1"
    })

    //const check = this.objectComparisonService.isThereAnyUnfilledObj(formValues);
    if(this.deferralForm.invalid){
      this.toasterService.showError('Mandatory Fields Missing', '')
      return;
    }
    const isCheckRoleId = this.isRoleIdCheck.every((data)=>{
      return data === true;
    })
    console.log('isCheckRoleId', isCheckRoleId)
    if(!isCheckRoleId){
      this.toasterService.showError('Invalid USER Please check', 'RECEIVED BY')
      return;
    }
    this.saveDefDoc(formValues)
  }

  saveDefDoc(data) {
    this.uploadService
      .saveOrUpdateDocument(data)
      .subscribe((value: any) => {
        const processVariables = value.ProcessVariables;
        if(processVariables.error.code === '0'){
          this.toasterService.showSuccess('Documents saved successfully', '');
          const documentIds = processVariables.documentIds;
          const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
          documentIds.forEach((id, index) => {
            // this.documentArr[index].documentId = id;
            formArray['controls'][index].get('documentId').setValue(id);
          });
          this.apiValue = formArray.getRawValue();
        }else{
          this.toasterService.showError(processVariables.error.message, '');
        }
        
      });
  }

  onSubmit() {

    const formArray = this.deferralForm.get('defDocumentArray') as FormArray;
    const formValues = formArray.getRawValue();

    const isAnyUnsaved = this.objectComparisonService.compare(this.apiValue, formValues)
    console.log('isAnyUnsaved', this.objectComparisonService.compare(this.apiValue, formValues))
    if(!isAnyUnsaved){
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    
    const todayDate = new Date()
    formValues.forEach((data)=>{
      data.deferredDate = this.utilityService.getDateFormat(data.deferredDate),
      data.receivedOn = this.utilityService.convertDateTimeTOUTC(todayDate, 'DD/MM/YYYY HH:mm')
      data.isDeferred = "1"
    })
    console.log(formValues,'this.documentDetails', this.documentDetails)


    const isAllDocUpload = formValues.every((data)=>{
      return !!data.dmsDocumentId
    })
    console.log('isAllDocUpload', isAllDocUpload)
    if(!isAllDocUpload){
      this.toasterService.showError('Please Upload all the documents', '')
      return;
    }
    //return alert ('submitted Successfully')
    // const taskId = ''
    const taskId = this.sharedService.getTaskIdDef();
    
    const datas = {
      leadId : this.leadId,
      taslId : taskId,
      taskName : 'Document Deferral',
      documentDetails : formValues
    }
    //return console.log('datas', datas);
    this.deferralDocService.submitDefDocuments(datas).subscribe((data : any) => {
      const processVariables = data.ProcessVariables;
      if(processVariables.error.code === '0'){
        this.toasterService.showSuccess('Documents Submitted successfully', '');
          this.router.navigate([`pages/dashboard`]);
      }else{
        this.toasterService.showError(processVariables.error.message, '');
      }
    })
  }

  checkRoleId(formValues){
    
   formValues.forEach((ele)=>{
     this.isRoleIdCheck.push(this.branchUsers.some((branch)=>{
        return ele.receivedBy === branch;
      }))
    })
    console.log('this.isRoleIdCheck', this.isRoleIdCheck)

    
  }


  onRoleIdCleared(val){
    this.roleIdList = []
  }

  onRoleIdSearch(val){
     if(val && val.length >2){
      this.roleIdList = this.branchUsers.filter((el)=>{
        const enteredVal = val.toString().toLowerCase();
        const apiVal = el.toString().toLowerCase();
        if(apiVal.includes(enteredVal)){
          return el;
        }
      })
      console.log('this.roleIdList',this.roleIdList)
     }
   
  }

  selectRoleId(index){
    console.log('index', index)
    if(!this.isRoleIdCheck[index]){
      this.isRoleIdCheck[index] = true;
    }
  }

}
