import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentUploadService } from '@services/document-upload.service';
import { UploadService } from '@services/upload.service';

@Component({
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  imageUrl: string;
  showModal: boolean;
  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private doucmentUploadService: DocumentUploadService,
    private uploadService: UploadService
  ) {}
  leadId;
  isModelShow = false;
  errorMessage: string;
  addDocReq = [];
  ngOnInit() {
    this.aRoute.parent.params.subscribe((val) => (this.leadId = val.leadId));
  }

  submitToCredit() {
    const data = {
      userId: localStorage.getItem('userId'),
      leadId: Number(this.leadId),
    };
    console.log('submit call');
    this.doucmentUploadService.submitToCredit(data).subscribe((response) => {
      if (
        response['Error'] &&
        response['Error'] == 0 &&
        response['ProcessVariables'].error['code'] == 0
      ) {
        this.errorMessage = 'Submit to Credit Sucessful';
        this.isModelShow = true;
      }
    });
  }

  navigateToDashBoard() {
    this.isModelShow = false;
    this.router.navigateByUrl(`/pages/dashboard/leads-section/leads`);
  }
  uploadFile() {
    this.uploadService.constructUploadModel(this.addDocReq).subscribe(
      (value) => {
        console.log('value', value);
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  async onFileSelect(event) {
    console.log('event', event);
    const files = event.target.files[0];
    const base64: any = await this.toBase64(files);
    this.imageUrl = base64;
    this.showModal = true;
    this.addDocReq = [
      {
        docTp: 'LEAD',
        docSbCtgry: 'ACCOUNT OPENING FORM',
        docNm: 'ACCOUNT_OPENING_FORM20206216328474448.pdf',
        docCtgryCd: 70,
        docCatg: 'KYC - I',
        docTypCd: 276,
        flLoc: '',
        docCmnts: 'Addition of document for Lead Creation',
        bsPyld: base64,
        docSbCtgryCd: 204,
        docRefId: [
          {
            idTp: 'LEDID',
            id: 20059563,
          },
          {
            idTp: 'BRNCH',
            id: 1001,
          },
        ],
      },
    ];
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
