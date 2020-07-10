import { Component, OnInit, OnDestroy } from '@angular/core';
import { element } from 'protractor';
import { LoginStoreService } from '../../../services/login-store.service';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '../../../services/commom-lov-service';
import { commonRoutingUrl } from '../../shared/routing.constant';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { storage } from '../../../storage/localstorage';





declare var identi5: any;



@Component({
  selector: 'app-dashboard',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.css']
})
export class ActivitySearchComponent implements OnInit, OnDestroy {

  openProfile: boolean;
  seletedRoute: string;
  searchText: string;
  searchLead: any;
  searchDiv = false;
  userName: string;
  firstLetter: string;
  branchName: string;
  roles = [];
  dropDown: boolean;
  routingId: string;
  activityList = [];
  routingModule: string;

  isMobile: any;
  pid: any;

  imageURI: any;
  cameraImage: any;
  fileName: string;




  bodyClickEvent = event => {
    if (event.target.id === 'profileDropDown') {
      this.openProfile = true;
      return;
    }
    this.openProfile = false;
  }

  constructor(
    private loginStoreService: LoginStoreService,
    private dashboardService: DashboardService,
    private route: Router,
    private camera: Camera,
    private transfer: FileTransfer
    ) {
  }

  ngOnInit() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userName = roleAndUserDetails.userDetails.firstName;
    this.firstLetter = this.userName.slice(0, 1);
    this.branchName = roleAndUserDetails.userDetails.branchName;
    this.roles = roleAndUserDetails.roles;
    this.activityList = roleAndUserDetails.activityList;

    document
      .querySelector('body')
      .addEventListener('click', this.bodyClickEvent);
  }

  getvalue(enteredValue: string) {
    this.dropDown = (enteredValue === '') ? false : true;
    const sections = this.activityList;

    this.searchLead = sections.filter(e => {
      enteredValue = enteredValue.toLowerCase();
      const eName = e.name.toLowerCase();
      if (eName.includes(enteredValue)) {
        return e;
      }
      this.dropDown = true;
    });
  }

  getRoute(id, name) {
    this.searchText = name;
    this.routingId = id;
    this.dropDown = false;
  }

  navigateToModule() {
    commonRoutingUrl.map(element => {
      if (element.routeId === this.routingId) {
        this.route.navigateByUrl(element.routeUrl);
      }
    });
  }

  ngOnDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.bodyClickEvent);
  }


  initIdenti5(){
    // let dInfo = new device();
    // console.log(dInfo.model);
    var that = this;
    this.pid = "";

    identi5.getInfo(function(result){
      console.log("Result&&&&"+ result);
      that.pid = result["model"];
      console.log("base64Data"+ that.pid);
      alert(that.pid);
      that.prepareKYCRequest(that.pid);
    },function(error){
      console.log("Result&&&&"+ error);
      alert("error"+error);
    });
  
  }

//   <KycRequest>
//     <TransactionInfo>
//         <UID type="U">974280197025</UID>
//         <Transm_Date_time>0306070758</Transm_Date_time>
//         <Local_Trans_Time>070758</Local_Trans_Time>
//         <Local_date>null</Local_date>
//         <Mcc>6012</Mcc>
//         <CA_TID>11205764</CA_TID>
//         <CA_ID>EQT000000000001</CA_ID>
//         <CA_TA>CSB NERUL MUMBAI MHIN</CA_TA>
//         <Stan>168205</Stan>
//     </TransactionInfo>
//     <KycReqInfo ver="2.5" ra="O" rc="Y" pfr="Y" lr="Y"  de="N" >
//         <Auth  txn="UKC:795251"  ver="2.5">
//             <Uses pi="n" pa="n" pfa="n"  bio="n" otp="y"/>
//             <Meta/>
//             <Skey ci="20201030">Zf3X+c3ff6Zxto8wGJcfbgZuRQAhkgqgoOO0ekQZjJ1/q3Fli9iAClD/1vwoUTLx7eoEnc6xMwvFdYGmX7tI9luDpiI5HLXbS1nbXxwtWiRYjD7f5gjPFkdnm6A0DUfvGCtblSN/eVxAhvAKX15D0VyIblO//mI6hwN9LgSZPBmR04DdR5aDfkhQNccJkIwXRbARp7dVX83gCoIdqYa3q822Qp0o6F37Z24vrZkRVlI1FmeeZcrS4ck9xpuSiOGDCLEvv6rGJRFu682rYAPE26bAl8/L/nnJmV03vz75s/Fu2Idm4+M+BrlkMY8Fv1izSno445bWH6+cILtGW835DA==</Skey>
//             <Data type="P">MjAyMC0wMy0wNlQyMDozNzo1OEwc9fx9kiQ2lksxYBftRk6tJVxfRdM+4DaO9Lpc+DPU1ouk/Yp8z43MffJqmRgZVrmEarAkQw==</Data>
//             <Hmac>tfQEIbXddB6HC9YrtBoMBLqpL2oYiDcIwemxtXH5SmMSJfgrlqyLJxAkA9P3Gcy1</Hmac>
//         </Auth>
//     </KycReqInfo>
// </KycRequest>

  prepareKYCRequest(pid) {
   let stan =  Math.floor(100000 + Math.random() * 900000);
   console.log(stan);

   let now = moment().format("MMDDhhmmss");
   let localDate = moment().format("MMDD");
   let localTime = moment().format("hhmmss");


   let pId = pid;

   console.log("pId"+pId);

   console.log("now"+now);
   console.log("localDate"+localDate);



      
    let kycRequest =  "<KycRequest>"+
                        "<TransactionInfo>"+
                          "<UID type=\"U\">"+"802172334890"+"</UID>"+
                          "<Transm_Date_time>"+now+"</Transm_Date_time>"+
                          "<Local_Trans_Time>"+localTime+"</Local_Trans_Time>"+
                          "<Local_date>"+localDate+"</Local_date>"+
                          "<CA_TID>"+"11205764"+"</CA_TID>"+
                          "<CA_ID>"+"EQT000000001441"+"</CA_ID>"+
                          "<CA_TA>"+"Equitas Bank Chennai TNIN"+"</CA_TA>"+
                          "<Stan>"+stan+"</Stan>"+
                        "</TransactionInfo>"+
                        pId+
                      "</KycRequest>";

    console.log("kycRequest"+kycRequest);

    const data = {
      ekycRequest: kycRequest,
    };
    this.dashboardService.getKycDetails(data).subscribe((res: any) => {
      console.log("KYC result"+JSON.stringify(res));
    });

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
      this.imageURI = uri;

      let url = uri.split('/');
      url = url[url.length - 1];

      this.cameraImage = (window as any).Ionic.WebView.convertFileSrc(
        this.imageURI
      )
        .toString()
        .split('cache/')[1];

      console.log('Camera Image', this.cameraImage);

      let applicationId = "1234";

      let applicantId = "56";

      this.fileName =
      applicationId +
      '-' +
      applicantId +
      '-' +
      new Date().getTime();

      console.log('fileName', this.fileName);
      
      let response: any;


      this.uploadToAppiyoDriveMobile(this.fileName, this.imageURI).then(data => {
        console.log("Data", data);
      }).catch(error => {
        console.log("error", error);
      });
    });
  }

  async uploadToAppiyoDriveMobile(fileName, imageURI) {
    return new Promise((resolve, reject) => {
      this.uploadFile(fileName, imageURI)
        .then(data => {
          if (data['responseCode'] == 200) {
            var result = JSON.parse(data['response']);
            resolve(result);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  uploadFile(fileName, imageURI) {

    let trustAllHosts = true;

    const fileTransfer: FileTransferObject = this.transfer.create();

    console.log("fileTransfer", fileTransfer);

    let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: fileName,
        chunkedMode: false,
        headers: {
        "X-Requested-With":"XMLHttpRequest",
        'authentication-token':
        storage.getToken() ? storage.getToken() : ''
        }
    }


    console.log("FileUploadOptions", fileTransfer);

    return fileTransfer.upload(imageURI, encodeURI(environment.host + environment.appiyoDrive) , options, true)

  }
}
