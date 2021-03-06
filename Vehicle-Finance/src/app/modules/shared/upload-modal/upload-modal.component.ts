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
import { ToasterService } from '@services/toaster.service';

// import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';


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

  inAppCamera:boolean = false;

  constructor(
    private uploadService: UploadService,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private camera: Camera,
    private domSanitizer: DomSanitizer
    // private webview: WebView,
    
  ) {
    this.isMobile = environment.isMobile;
  }

  async onFileSelect(event) {
    this.showError = '';
    const files: File = event.target.files[0];
    if (!files.type) {
      const type = files.name.split('.')[1];
      this.fileType = this.getFileType(type);
    } else {
      this.fileType = this.getFileType(files.type);
    }
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

    const base64: any = await this.toBase64(event);
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

  toBase64(evt) {
    return new Promise((resolve, reject) => {
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = (function(theFile) {
      //   return function(e) {
      //     const binaryData = e.target.result;
      //     const base64String = window.btoa(binaryData);
      //     console.log('base64String', base64String);
      //     resolve(base64String)
      //   };
      // })(file);
      var f = evt.target.files[0]; // FileList object
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
          var binaryData = e.target.result;
          //Converting Binary Data to base 64
          var base64String = window.btoa(binaryData);
          resolve(base64String)
          //showing file converted to base64
          // document.getElementById('base64').value = base64String;
          // alert('File converted to base64 successfuly!\nCheck in Textarea');
        };
      })(f);
      // Read in the image file as a data URL.
      reader.readAsBinaryString(f);
      // Read in the image file as a data URL.
      // reader.readAsBinaryString(file);
      // reader.onloadend = () => {
      //   let result = '';

      //   if (this.fileType === 'jpeg' || this.fileType === 'png') {
      //     result = reader.result
      //       .toString()
      //       .replace(/^data:image\/[a-z]+;base64,/, '');
      //   } else if (this.fileType === 'pdf') {
      //     result = reader.result
      //       .toString()
      //       .replace(/^data:application\/[a-z]+;base64,/, '');
      //   } else if (this.fileType.includes('xls')) {
      //     result = reader.result.toString().split(',')[1];
      //   } else if (this.fileType === 'docx') {
      //     result = reader.result.toString().split(',')[1];
      //   } else {
      //     result = reader.result.toString();
      //   }
      //   resolve(result);
      // };

      // reader.onerror = (error) => reject(error);
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
      'application/msword': 'docx'
    };
    return types[type] || type;
  }

  uploadFile() {
    this.docsDetails.bsPyld = this.imageUrl;
    // let name = this.docsDetails.docNm.replace(' ', '_');
    let name = this.docsDetails.docNm;
    name = name.replace('/', '_OR_');   
    let fileName = '';
    if (this.docsDetails.docCtgryCd === 50) {
      fileName = name + '.' + this.fileType;
    } else {
      fileName =
      name +
      new Date().getFullYear() +
      +new Date() +
      '.' +
      this.fileType;
    }
    this.docsDetails.docNm = fileName;
    const addDocReq = [
      {
        // ...this.docsDetails,
        docTp: this.docsDetails.docTp,
        docSbCtgry: this.docsDetails.docSbCtgry,
        docNm: this.docsDetails.docNm,
        docCtgryCd: this.docsDetails.docCtgryCd,
        docCatg: this.docsDetails.docCatg,
        docTypCd: this.docsDetails.docTypCd,
        flLoc: this.docsDetails.flLoc,
        docCmnts: this.docsDetails.docCmnts,
        bsPyld: this.docsDetails.bsPyld,
        docSbCtgryCd: this.docsDetails.docSbCtgryCd,
        docRefId: this.docsDetails.docRefId,

      },
    ];
    this.uploadService
      .constructUploadModel(addDocReq)
      .pipe(
        map((value: any) => {
          const msgHdr = value.addDocumentRep.msgHdr;
          if (msgHdr.rslt === 'OK') {
            const body = value.addDocumentRep.msgBdy;
            const docsRes = body.addDocResp[0];
            const docsDetails = {
              ...docsRes,
            };
            return docsDetails;
          } else if (msgHdr.rslt === 'ERROR') {
            const error = msgHdr.error[0].rsn;
            this.toasterService.showError(error, 'Upload Error');

            throw new Error(error);
          }
          // throw new Error('error');
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
            deferredDate:
              this.utilityService.getDateFormat(
                this.docsDetails.deferredDate
              ) || '',
            isDeferred: this.docsDetails.isDeferred,
          };
          if (
            this.docsDetails.docsTypeForString === 'profile' ||
            this.docsDetails.docsTypeForString === 'signature' ||
            this.docsDetails.docsTypeForString === 'selfie'
          ) {
            documentDetails.imageUrl = this.imageUrl;
            documentDetails.docsTypeForString = this.docsDetails.docsTypeForString;
          }
          documentDetails['fileName'] = this.fileName;
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
    this.inAppCamera = true;
    // this.takePicture().then((uri) => {
    //   this.imageUrl = uri;
    //   this.fileName = Math.random().toString(36).substring(2, 15);
    //   this.fileSize = ""
    //   this.fileType = "png";
    // });
  }

  onClose() {
    this.close.emit();
    this.removeFile();
  }

  getMobileBase64(obj) {
    // this.imageUrl = this.webview.convertFileSrc(data.nativeURL);
    // this.fileName = data.name;
   // this.imageUrl = data.nativeURL;

   let data = obj.base64;

   this.fileName = obj.fileName;

   var block = data.split(";");
   // Get the content type
   var dataType = block[0].split(":")[1];// In this case "image/png"

   // get the real base64 content of the file
   var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
   console.log("realData"+ realData);

   this.fileType = "png";

    this.imageUrl = realData;
    this.inAppCamera = false;
  }

  onBackPressed(){
    this.inAppCamera= false;
  }

  onClosePressed() {
    this.inAppCamera= false;
  }
}
