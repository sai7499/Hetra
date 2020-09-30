import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LoginStoreService } from '../../../services/login-store.service';
import { storage } from '../../../storage/localstorage';
import { CommonDataService } from '@services/common-data.service';

import * as moment from 'moment';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { GpsService } from 'src/app/services/gps.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilityService } from '@services/utility.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Camera } from '@ionic-native/camera/ngx';
import { ConfigService } from '@services/config.service';

declare var identi5: any;
declare var cordova: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  fileName: string;
  direction: any;
  labels: any = {};

  loginForm: FormGroup;

  loginData: {
    email: string;
    password: string;
    useADAuth: boolean;
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

  base64Image: any;

  appVersion;
  buildDate;

  isModelShow: boolean;
  errorMessage: string;
  configUrl;






  constructor(
    private loginService: LoginService,
    private router: Router,
    private labelsData: LabelsService,
    private loginStoreService: LoginStoreService,
    private cds: CommonDataService,
    private gmapsApi: GoogleMapsAPIWrapper,
    private deviceService: DeviceDetectorService,
    private camera: Camera,
    private dashboardService: DashboardService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private utilityService: UtilityService,
    private configService: ConfigService
  ) {
    this.isMobile = environment.isMobile;
  }

  ngOnInit() {
    console.log("base url",window.location.origin);
    this.appVersion = environment.version;
    this.buildDate = environment.buildDate;
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data.default;
        console.log(this.labels);
      },
      (error) => {
        console.log(error);
      }
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });


    if (storage.checkToken()) {
      this.router.navigateByUrl('activity-search');
    }

    // alert("test");
    /* Get latitude and longitude from mobile */
    // if (this.isMobile) {
    //   this.gpsService.getLatLong().subscribe((position) => {
    //     console.log("getLatLong", position);
    //     this.gpsService.initLatLong().subscribe((res) => {
    //       console.log("gpsService", res);
    //       if (res) {
    //         this.gpsService.getLatLong().subscribe((position) => {
    //           console.log("getLatLong", position);
    //         });
    //       } else {
    //         console.log("error initLatLong",res);
    //       }
    //     });
    //   });
    // } else {
    //   this.gpsService.getBrowserLatLong().subscribe((position) => {
    //   });
    // }
    // this.getRouteMap();
  }

  enter(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  login() {
    this.loginData = this.loginForm.value; 
    
    // this.loginData.email = this.loginData.email + this.configUrl.userConfig;
    this.loginData.email = this.loginData.email + window["env"]["userConfig"];
    this.loginData.useADAuth = window["env"]["useADAuth"];
    // if (environment.hostingEnvironment === 'DEV') {
    //   this.loginData.email = `${this.loginData.email}@equitasbank.in`;
    //   this.loginData.useADAuth = false;
    // } else if (environment.hostingEnvironment === 'UAT') {
    //   this.loginData.email = `${this.loginData.email}@esfbuat.in`;
    //   this.loginData.useADAuth = true;
    // } else {
    //   this.loginData.email = `${this.loginData.email}@equitas.in`;
    // }
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
              localStorage.setItem('branchId', userDetails.branchId);
              localStorage.setItem('userId', userId);
              let userRoleActivityList = response.ProcessVariables.userRoleActivityList;
              this.loginStoreService.setRolesAndUserDetails(
                roles,
                userDetails,
                businessDivisionList,
                activityList,
                userRoleActivityList
              );
              this.router.navigateByUrl('/activity-search');
            }
          });
        }
      },
      (err) => {
        this.ngxUiLoaderService.stop();
        this.isModelShow = true;
        // alert('Invalid Login');
        this.errorMessage = "Invalid Login"
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

  // getRouteMap() {
  //   var that = this;
  //   this.loginService.getPolyLine(function (result) {
  //     that.base64Image = result;
  //     // console.log("getPolyLine", that.base64Image);
  //   }, null, null);
  // }
}






