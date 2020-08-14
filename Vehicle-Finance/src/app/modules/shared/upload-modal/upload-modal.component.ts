import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
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
import { UtilityService } from '@services/utility.service';
import { DocRequest } from '@model/upload-model';
import { DocumentDetails } from '@model/upload-model';
import { Constant } from '@assets/constants/constant';
import { environment } from 'src/environments/environment';

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
  showError: string;
  @Input() showModal: boolean;
  @Input() docsDetails: DocRequest;
  @Output() close = new EventEmitter();
  @Output() uploadSuccess = new EventEmitter();

  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;
  isMobile: any;

  constructor(
    private uploadService: UploadService,
    private utilityService: UtilityService,
    private camera: Camera
  ) {
    this.isMobile = environment.isMobile;
  }

  async onFileSelect(event) {
    this.showError = '';
    const files: File = event.target.files[0];
    this.fileType = this.getFileType(files.type);
    if (this.checkFileType(this.fileType)) {
      this.showError = `Only files with following extensions are allowed: ${this.docsDetails.docsType}`;
      return;
    }
    if (this.checkFileSize(files.size)) {
      this.showError = `File is too large. Allowed maximum size is ${this.bytesToSize(
        this.docsDetails.docSize
      )}`;
      return;
    }

    const base64: any = await this.toBase64(files);
    console.log('base64', base64);
    this.imageUrl = base64;
    this.fileSize = this.bytesToSize(files.size);
    this.fileName = files.name;
    // this.fileType = files.type;
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

    // if (!this.docsDetails.docsType.includes(fileType.toLowerCase())) {
    //   return true;
    // }
    // return false;
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        let result = '';

        if (this.fileType === 'jpeg' || this.fileType === 'png') {
          result = reader.result
            .toString()
            .replace(/^data:image\/[a-z]+;base64,/, '');
        } else if (this.fileType === 'pdf') {
          result = reader.result
            .toString()
            .replace(/^data:application\/[a-z]+;base64,/, '');
        } else if (this.fileType === 'xls') {
          // data:image/jpeg;base64,data:application/vnd.ms-excel;base64,
          result = reader.result.toString().split(',')[1];
          // .replace(/^data:application\/[a-z]+;base64,/, '');
        } else {
          result = reader.result.toString();
        }
        resolve(result);
      };

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
    this.showError = '';
    this.imageUrl = '';
    this.fileName = '';
    this.fileSize = '';
    this.fileInput.nativeElement.value = '';
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
    };
    return types[type] || type;
  }

  uploadFile() {
    this.docsDetails.bsPyld = this.imageUrl;
    let fileName = this.docsDetails.docSbCtgry.replace(' ', '_');
    fileName =
      this.docsDetails.docNm +
      new Date().getFullYear() +
      +new Date() +
      '.' +
      this.fileType;
    this.docsDetails.docNm = fileName;
    const addDocReq = [
      {
        ...this.docsDetails,
      },
    ];
    console.log('docsDetails', this.docsDetails);
    this.uploadService
      .constructUploadModel(addDocReq)
      .pipe(
        map((value: any) => {
          if (value.addDocumentRep.msgHdr.rslt === 'OK') {
            const body = value.addDocumentRep.msgBdy;
            const docsRes = body.addDocResp[0];
            console.log('docsRes', docsRes);
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
          const documentDetails: DocumentDetails = {
            documentId: this.docsDetails.documentId,
            documentType: String(this.docsDetails.docTypCd),
            documentName: String(this.docsDetails.docTypCd),
            documentNumber: this.docsDetails.documentNumber,
            dmsDocumentId: value.docIndx,
            categoryCode: String(this.docsDetails.docCtgryCd),
            issuedAt: 'check',
            subCategoryCode: String(this.docsDetails.docSbCtgryCd),
            issueDate:
              this.utilityService.getDateFormat(this.docsDetails.issueDate) ||
              '',
            expiryDate:
              this.utilityService.getDateFormat(this.docsDetails.expiryDate) ||
              '',
            associatedId: this.docsDetails.associatedId,
            associatedWith: this.docsDetails.associatedWith,
            formArrayIndex: this.docsDetails.formArrayIndex,
            deferralDate:
              this.utilityService.getDateFormat(
                this.docsDetails.deferralDate
              ) || '',
            isDeferred: this.docsDetails.isDeferred,
          };
          if (
            this.docsDetails.docsTypeForString === 'profile' ||
            this.docsDetails.docsTypeForString === 'signature'
          ) {
            documentDetails.imageUrl = this.imageUrl;
            documentDetails.docsTypeForString = this.docsDetails.docsTypeForString;
          }
          this.uploadSuccess.emit(documentDetails);
          this.imageUrl = '';
          this.fileName = '';
          this.fileSize = '';
          this.fileInput.nativeElement.value = '';
        },
        (error) => {
          console.log('error', error);
        }
      );
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false,
    };

    return this.camera.getPicture(options);
  }

  openCamera() {
    this.takePicture().then((uri) => {
      console.log('imageData', uri);
      this.imageUrl = uri;
      this.fileName = Math.random().toString(36).substring(2, 15);
      this.fileSize = '';
      this.fileType = 'png';
      console.log('fileName', this.fileName);
      console.log('fileSize', this.fileSize);
    });
  }

  onClose() {
    this.close.emit();
    this.removeFile();
  }
}
