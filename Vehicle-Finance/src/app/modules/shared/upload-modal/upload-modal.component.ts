import {
  Component,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
} from '@angular/core';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

import { UploadService } from '@services/upload.service';
import { DocRequest } from '@model/upload-model';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css'],
})
export class UploadModalComponent {
  imageUrl: string;
  fileSize: string;
  fileName: string;
  fileType: string;
  @Input() showModal: boolean;
  @Input() docsDetails: DocRequest;
  @Output() close = new EventEmitter();
  @Output() uploadSuccess = new EventEmitter();

  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;

  constructor(private uploadService: UploadService) {}

  async onFileSelect(event) {
    const files: File = event.target.files[0];
    const base64: any = await this.toBase64(files);
    this.imageUrl = base64;
    this.fileSize = this.bytesToSize(files.size);
    this.fileName = files.name;
    this.fileType = files.type;
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  removeFile() {
    this.imageUrl = '';
    this.fileName = '';
    this.fileSize = '';
    this.fileInput.nativeElement.value = '';
  }

  uploadFile() {
    this.docsDetails.bsPyld = this.imageUrl;
    let fileName = this.docsDetails.docSbCtgry.replace(' ', '_');
    fileName =
      this.docsDetails.docNm +
      new Date().getFullYear() +
      +new Date() +
      '.' +
      'pdf';
    this.docsDetails.docNm = fileName;
    const addDocReq = [
      {
        ...this.docsDetails,
      },
      // {
      //   docTp: 'LEAD',
      //   docSbCtgry: 'ACCOUNT OPENING FORM',
      //   docNm: 'ACCOUNT_OPENING_FORM20206216328474448.pdf',
      //   docCtgryCd: 70,
      //   docCatg: 'KYC - I',
      //   docTypCd: 276,
      //   flLoc: '',
      //   docCmnts: 'Addition of document for Lead Creation',
      //   bsPyld: this.imageUrl,
      //   docSbCtgryCd: 204,
      //   docRefId: [
      //     {
      //       idTp: 'LEDID',
      //       id: 20059563,
      //     },
      //     {
      //       idTp: 'BRNCH',
      //       id: 1001,
      //     },
      //   ],
      // },
    ];
    console.log('docsDetails', this.docsDetails);
    this.uploadService
      .constructUploadModel(addDocReq)
      .pipe(
        map((value: any) => {
          if (value.addDocumentRep.msgHdr.rslt === 'OK') {
            const body = value.addDocumentRep.msgBdy;
            const docsRes = body.addDocResp[0];
            const docsDetails = {
              ...docsRes,
            };
            return docsDetails;
          }
          throw new Error('error');
        })
      )
      .subscribe(
        (value) => {
          console.log('value', value);
          this.uploadSuccess.emit(value);
        },
        (error) => {
          console.log('error', error);
        }
      );
  }

  onClose() {
    this.close.emit();
  }
}
