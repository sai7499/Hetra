import { DeviceDetectorService } from 'ngx-device-detector';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LoginStoreService } from '../../../services/login-store.service';
import { storage } from '../../../storage/localstorage';
import { CommonDataService } from '@services/common-data.service';

import * as moment from 'moment';


// import {GoogleMapsAPIWrapper} from '@agm/core';

// import { GpsService } from 'src/app/services/gps.service';

// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { GoogleMapsAPIWrapper } from '@agm/core';
import { GpsService } from 'src/app/services/gps.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { environment } from 'src/environments/environment';
import { DashboardService } from '@services/dashboard/dashboard.service';

declare var device: any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  direction: any;
  labels: any = {};

  loginForm: FormGroup;

  loginData: {
    email: string;
    password: string;
  };

  lat: any;
  lng: any;
  zoom: any;
  flag: boolean;
  imageURI: any;
  cameraImage: any;

  geoLocationError = {
    1: 'PERMISSION_DENIED',
    2: 'POSITION_UNAVAILABLE',
    3: 'TIMEOUT',
  };

  isMobile: any;
  base64Data: any;
  pid: any;


  appVersion;
  buildDate;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private labelsData: LabelsService,
    private loginStoreService: LoginStoreService,
    private cds: CommonDataService,
    private gmapsApi: GoogleMapsAPIWrapper,
    private gpsService: GpsService,
    private deviceService: DeviceDetectorService,
    private camera: Camera,
    private dashboardService: DashboardService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
    this.appVersion = environment.version;
    this.buildDate = environment.buildDate
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        console.log(error);
      }
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    /* Get latitude and longitude from mobile */
    if (this.isMobile) {
      this.gpsService.initLatLong().subscribe((res) => {
        if (res) {
          this.gpsService.getLatLong().subscribe((position) => {
            console.log('login position', position);
          });
        } else {
          console.log(res);
        }
      });
    } else {
      this.gpsService.getBrowserLatLong().subscribe((position) => {
        console.log('login position', position);
      });
    }
  }

  enter(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  login() {
    this.loginData = this.loginForm.value;      
    if (environment.hostingEnvironment === 'Production') {
      this.loginData.email = `${this.loginData.email}@equitasbank.in`;
    } else if(environment.hostingEnvironment === 'UAT'){
      this.loginData.email = `${this.loginData.email}@esfbuat.in`;
    }else{
      this.loginData.email = `${this.loginData.email}@equitas.in`;
    }
    this.loginService.getLogin(this.loginData).subscribe(
      (res: any) => {
        this.loginForm.reset();
        const response = res;
        if (response.status) {
          const token = response.token;
          console.log('token', token);
          localStorage.setItem('token', token);
          this.loginStoreService.setEmailId(this.loginData.email);

          this.loginService.getUserDetails().subscribe((res: any) => {
            const response = res;
            if (response.Error === '0') {
              const roles = response.ProcessVariables.roles;
              const userDetails = response.ProcessVariables.userDetails;
              const businessDivisionList =
                response.ProcessVariables.businessDivisionLIst;
              const activityList = response.ProcessVariables.activityList;
              const userId = response.ProcessVariables.userId;
              localStorage.setItem('userId', userId);
              this.loginStoreService.setRolesAndUserDetails(
                roles,
                userDetails,
                businessDivisionList,
                activityList
              );
              this.router.navigateByUrl('/activity-search');
              // const role = response.ProcessVariables.roles[0].name;
              // if (role === 'Sales Officer') {
              //   this.router.navigateByUrl('/activity-search');
              // }
            }
          });
        }
      },
      (err) => {
        alert('Invalid Login');
        this.loginForm.reset();
      }
    );
  }

  showMap() {
    this.flag = true;
    this.lat = 12.963134;
    this.lng = 80.198337;
    // google maps zoom
    this.zoom = 14;

    this.direction = {
      origin: { lat: 12.963134, lng: 80.198337 },
      destination: { lat: 12.990884, lng: 80.242167 },
    };
  }

  openMap() {
    let dirUrl =
      'https://www.google.com/maps/dir/?api=1&origin=12.963134,80.198337&destination=12.990884,80.242167';
    window.open(dirUrl, '_blank', 'location=yes');
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
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
    });
  }

  initIdenti5(){
    // let dInfo = new device();
    // console.log(dInfo.model);
    var that = this;
    this.pid = "";

    device.getInfo(function(result){
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
                         "<KycReqInfo ver=\"2.5\"  ra=\"O\" rc=\"Y\" pfr=\"N\" lr=\"Y\"  de=\"N\" >"+
                           "<Auth  txn=\"UKC:"+stan+"\"  ver=\"2.5\">"+
                             "<Uses pi=\"n\" pa=\"n\" pfa=\"n\"  bio=\"y\" otp=\"n\"/>"+
                             "<Meta/>"+pId+
                           "</Auth>"+
                         "</KycReqInfo>"+
                       "</KycRequest>";
 
     console.log("kycRequest"+kycRequest);
 
     const data = {
       ekycRequest: kycRequest,
     };
     this.dashboardService.getKycDetails(data).subscribe((res: any) => {
       console.log("KYC result"+JSON.stringify(res));
     });
 
   }
}
