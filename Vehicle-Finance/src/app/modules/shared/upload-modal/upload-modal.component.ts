import { Component, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UploadService } from '@services/upload.service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css'],
})
export class UploadModalComponent {
  imageUrl: string;
  fileSize: string;
  fileName: string;
  @Input() showModal: boolean;
  @Input() file: File;

  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;

  constructor(private uploadService: UploadService) {}

  async onFileSelect(event) {
    const files: File = event.target.files[0];
    const base64: any = await this.toBase64(files);
    this.imageUrl = base64;
    this.fileSize = this.bytesToSize(files.size);
    this.fileName = files.name;
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
    const addDocReq = [
      {
        docTp: 'LEAD',
        docSbCtgry: 'ACCOUNT OPENING FORM',
        docNm: 'ACCOUNT_OPENING_FORM20206216328474448.pdf',
        docCtgryCd: 70,
        docCatg: 'KYC - I',
        docTypCd: 276,
        flLoc: '',
        docCmnts: 'Addition of document for Lead Creation',
        bsPyld: this.imageUrl,
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
    this.uploadService.constructUploadModel(addDocReq).subscribe(
      (value) => {
        console.log('value', value);
      },
      (error) => {
        console.log('error', error);
      }
    );
  }
}
