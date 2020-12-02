import { Component, EventEmitter, OnInit, Output } from '@angular/core';


import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Observer } from 'rxjs';
import { File } from '@ionic-native/file/ngx';

//import { WebView } from '@ionic-native/ionic-webview/ngx';



export declare class writeOption {
  replace?: boolean;
  append?: boolean;
  truncate?: number;
}


@Component({
  selector: 'app-in-appcamera',
  templateUrl: './in-appcamera.component.html',
  styleUrls: ['./in-appcamera.component.css']
})
export class InAppcameraComponent implements OnInit {

  imgFile: string;

  title = 'InAppCameraAngular';
  
  fileWriteOption: writeOption;

  zoomValue: any = 0;
  
  zoomMaxValue: any;

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height-200,
    camera: 'rear',
    tapPhoto: true,
    previewDrag: true,
    toBack: true,
    alpha: 1
  }

  
  // picture options
  pictureOpts: CameraPreviewPictureOptions = {
    width: window.screen.width,
    height: window.screen.height,
    quality: 85
  }
  
  picture: string;
  originalImg: SafeResourceUrl;
  showPreview: boolean;
  showCropview: boolean;
  showCameraPreview: boolean;

  imageBase64: any = null;
  croppedImage: any = '';
  showOriginalImg: boolean;
  croppedPicture: any;

  @Output() fileURIChange = new EventEmitter();

  @Output() onBackKeyDown = new EventEmitter();

  

  constructor(private cameraPreview: CameraPreview,
    private file: File,
    private domSanitizer: DomSanitizer,
    //private webview: WebView
    ) {

      this.startCamera();
      this.showCameraPreview = true;
      this.cameraPreview.getMaxZoom().then((maxValue)=> {
        console.log("zoomMaxValue"+maxValue);
        this.zoomMaxValue = maxValue;
      });
      
      // take a snap shot
      this.cameraPreview.takeSnapshot(this.pictureOpts).then((imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        console.log(err);
        this.picture = 'assets/img/test.jpg';
      });

      this.cameraPreview.onBackButton().then((result)=>{
        this.cameraPreview.stopCamera();
        console.log("Backbutton"+result);
        this.onBackKeyDown.emit(result);
      }, (err)=>{
        console.log("Backbutton Err"+err);
      });
  
    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

   startCamera() {
    // start camera
    console.log("this.cameraPreviewOpts"+this.cameraPreviewOpts);
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
    });
  }

  takePictureButton(){
      // take a picture
      this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
          // Stop the camera preview
          this.cameraPreview.stopCamera();
          this.originalImg = this.picture;
          this.croppedImage = "";
          this.showPreview = true;
          this.showCropview = false;
          this.showCameraPreview = false;
          this.showOriginalImg = true;
          this.imageBase64 = null;      

      }, (err) => {
        console.log(err);
        this.picture = 'assets/img/test.jpg';
      });
    
  }

  deletePreview() {
    this.startCamera();
    this.originalImg= "";
    this.showPreview = false;
    this.showCropview = false;
    this.showCameraPreview = true;
  }

  confirmPreview() {
    console.log("Originm"+this.originalImg);
    this.imageBase64 = this.originalImg;
    this.showPreview = false;
    this.showCropview = true;
    this.showCameraPreview = false;
    this.showOriginalImg = false;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedPicture = event.base64;
  }

  confirmCrop() {
    this.croppedImage = this.croppedPicture;
    console.log("cropped image"+this.croppedImage);
    this.showOriginalImg = false;
    this.imageBase64 = "";

    // To define the type of the Blob
    var contentType = "image/png";
    var folderpath = this.file.externalCacheDirectory;
    var filename  = Math.random().toString(36).substring(2, 15);

    this.fileURIChange.emit(this.croppedImage);

    //this.savebase64AsImageFile(folderpath,filename,this.croppedImage,contentType);

  }

  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  
  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }

  b64toBlob(b64Data, contentType) {

    // Split the base64 string in data and contentType
    var block = b64Data.split(";");
    // Get the content type
    var dataType = block[0].split(":")[1];// In this case "image/png"

    console.log("DataType"+ dataType);
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

      contentType = dataType || '';
      let sliceSize = 512;

      var byteCharacters = atob(realData);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var that = this;
    var DataBlob = this.b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3"+ DataBlob);

    this.fileWriteOption = {
      replace: true
    }
    console.log(folderpath);

    setTimeout(function() {
      that.file.writeFile(folderpath, filename+ '.png', DataBlob, that.fileWriteOption).then((result)=>{
        console.log("result", result);
        that.fileURIChange.emit(result);
      //this.imgFile = this.webview.convertFileSrc(result.nativeURL);
      }).catch((err)=>{
        console.log('Write '+JSON.stringify(err));
      });

    }, 1000);


    // this.file.checkDir(this.file.externalApplicationStorageDirectory, 'DirectorioFotos')
    //     .then(_ => {
    //       this.file.writeFile(this.file.externalApplicationStorageDirectory + 'DirectorioFotos/', "UUID" + '.jpg', DataBlob, this.fileWriteOption).then(response => {
    //         // ACTION
    //         console.log("UUID"+response);
    //         this.fileURIChange.emit(response);
    //       }).catch(err => {
    //         // ACTION
    //         console.log("Err"+JSON.stringify(err));
    //         this.file.createDir(this.file.externalApplicationStorageDirectory, 'DirectorioFotos', false).then(result => {
    //           this.file.writeFile(this.file.externalApplicationStorageDirectory + 'DirectorioFotos/', "UUID" + '.jpg', DataBlob, this.fileWriteOption).then(response => {
    //             // ACTION
    //             console.log("UUID"+response);
    //             this.fileURIChange.emit(response);
    //           }).catch(err => {
    //             // ACTION
    //             console.log("Err"+JSON.stringify(err));
    //           })
    //         })  
    //       })
    //     })
    //     .catch(err => {
    //       this.file.createDir(this.file.externalApplicationStorageDirectory, 'DirectorioFotos', false).then(result => {
    //         this.file.writeFile(this.file.externalApplicationStorageDirectory + 'DirectorioFotos/', "UUID" + '.jpg', DataBlob).then(response => {
    //           // ACTION
    //           console.log("UUID"+response);
    //           this.fileURIChange.emit(response);
    //         }).catch(err => {
    //           // ACTION
    //           console.log("Err"+JSON.stringify(err));
    //         })
    //       })
    //     });


  }

  switchCameraButton(){
    this.cameraPreview.switchCamera();
  }

  retrySnap(){
    this.startCamera();
    this.imgFile = "";
    this.imageBase64 = "";
    this.originalImg = "";
    this.showPreview = false;
    this.showCropview = false;
    this.showCameraPreview = true;
    this.showOriginalImg = false;
    this.croppedPicture = "";
  }

  changeZoom(value) {
    this.zoomValue = value;
    this.cameraPreview.setZoom(this.zoomValue);
  }

}
