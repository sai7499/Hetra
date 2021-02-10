import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoanCreationService } from '@services/loan-creation.service';
import { ToasterService } from '@services/toaster.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { Base64StorageService } from '@services/base64-storage.service';
import { DraggableContainerService } from '@services/draggable.service';
import { UploadService } from '@services/upload.service';

@Component({
  selector: 'app-loan-status',
  templateUrl: './loan-status.component.html',
  styleUrls: ['./loan-status.component.css']
})
export class LoanStatusComponent implements OnInit {

  labels;
  validationData;
  leadId;
  processLogs = [];
  isLoadLead: boolean;

  documentId: any;
  leadData: any;
  setCss = {
    top: '',
    left: '',
  };


  constructor(
    private labelService: LabelsService,
    private router: Router, private uploadService: UploadService,
    private loanCreationService: LoanCreationService,
    private activateRoute: ActivatedRoute,
    private base64StorageService: Base64StorageService,
    private draggableContainerService: DraggableContainerService,
    private toasterService: ToasterService,
    private createLeadDataService: CreateLeadDataService
  ) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      console.log('label', res)
      this.validationData = res.validationData;
    });
   
    this.leadData = this.createLeadDataService.getLeadSectionData();

    this.getLoanProcessLogs();
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activateRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getLoanProcessLogs() {
    const data = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId')
    };
    this.loanCreationService.getLoanProcessLogs(data).subscribe((res: any) => {
      const response = res;
      console.log(response);

      this.processLogs = response.ProcessVariables.processLogDetails;
      console.log(this.processLogs);
      if (res.ProcessVariables.processLogDetails === null) {
        this.isLoadLead = false;
        this.processLogs = [];
      } else {
        this.isLoadLead = true;
      }

    });
  }
  Refresh() {
    this.getLoanProcessLogs();
  }

  onNext() {
    this.router.navigate([`/pages/loanbooking/${this.leadId}/welomce-letter`]);
  }
  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

  sendLoanCreationWrapper() {
    const body = {
      leadId: this.leadId
    }
    this.loanCreationService.setLoanCreation(body).subscribe((res: any) => {

      // tslint:disable-next-line: triple-equals
      if (res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Lead submitted For Loan Creation', '');
      //  this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }
  
  getEPolicy(data){

    let isChola = false;
    let isHdfc = false;
    let isICICI = false;

    if (data.stage && data.stage.includes('ICICI')) {
      isICICI = true;
      isChola = false;
      isHdfc = false;
    } else if (data.stage && data.stage.includes('CHOLA')) {
      isICICI = false;
      isChola = true;
      isHdfc = false;
    } else if (data.stage && data.stage.includes('HDFC')) {
      isICICI = false;
      isChola = false;
      isHdfc = true;
    } 
  
    const body = {
    "leadId": this.leadId,
    "userId": localStorage.getItem('userId'),
    "isCHOLA": isChola,
    "isICICI": isICICI,
    "isHDFC": isHdfc
    }
  
    this.loanCreationService.getEPolicyDetails(body).subscribe((res: any) => {
      console.log(res, 'res')
      if (res.Error === '0' && res.ProcessVariables.error.code == '0') {

        this.documentId = res.ProcessVariables.csDmsId ? res.ProcessVariables.csDmsId: 0;
        this.downloadDocsCheck(this.documentId)

      } else {
       this.toasterService.showError(res.ErrorMessage ? '' : res.ProcessVariables.error.message ,"Download E-Policy")
      }
    })
  }

  async downloadDocsCheck(documentId) {
    let el = documentId.srcElement;

    if (!documentId) {
      return;
    }

    let collateralId = this.leadData['vehicleCollateral'] ? this.leadData['vehicleCollateral'][0] : this.leadData['applicantDetails'][0];

    if (!collateralId) {
      return;
    }

    const bas64String = this.base64StorageService.getString(
      collateralId.collateralId + documentId
    );

    if (bas64String) {
      this.setContainerPosition(el);
      let showDraggableContainer = {
        imageUrl: bas64String.imageUrl,
        imageType: bas64String.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: showDraggableContainer,
        css: this.setCss,
      });
      return;
    }
    const imageValue: any = await this.getBase64String(documentId);
    this.getDownloadXlsFile(imageValue.imageUrl, imageValue.documentName, 'application/pdf');
    this.setContainerPosition(el);
    let showDraggableContainer = {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
    };
    this.draggableContainerService.setContainerValue({
      image: showDraggableContainer,
      css: this.setCss,
    });
    this.base64StorageService.storeString(collateralId.collateralId + documentId, {
      imageUrl: imageValue.imageUrl,
      imageType: imageValue.imageType,
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

  getBase64String(dmsDocumentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(dmsDocumentId)
        .subscribe((value) => {
          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
          });
        });
    });
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
