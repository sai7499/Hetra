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

declare var identi5: any;

declare var cordova:any;




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

  // Equitas

  developerId = "40026336";

  licenseKey = "7669E-A668C-99CJ8-B9EJJ-JJJJJ-J3C42";

 /*Test
  developerId = "0040035464";

  licenseKey = "7669E-A669B-ACAJE-9EFJJ-JJJJJ-JFCC7";*/

  maas360sdkEventHandler = {
    // Called when app is activating with MaaS360
    onActivatonInProgress: function() {
      console.log("ActivatonInProgress");
    },

    /* Called when activation status change
     *
     * activationInfoStr is a JSON string having following
     * information:
     * - billingid       : customer identification number
     * - csn             : MaaS360 unique device identifier
     * - username        : user name used during MaaS360 app activation
     * - emailAddress    : email address used during MaaS360 app activation
     * - activationState : state of activation,
     *                     values can be one of {NotConfigured, Enrolling, Activated, NotInstalled, NotEnrolled}
     * - deviceOwnership : device ownership,
                           values can be one of {"Not Defined", Corporate, "Corporate Shared", "Employee"}
     * - domain          : user domain used during MaaS360 app activation
     * - activationType  : type of activation of MaaS360 app, can be {NON-MDM, MDM}
     */
    onActivationStatusChange: function(activationInfoStr) {
        // application initialization code goes here
        console.log("activationInfoStr"+activationInfoStr);
    },

    /* Called when application configuration is available/changed
     *
     * configDataStr is a JSON string with application
     * configuration is defined as a value to 'appConfig' key.
     * The value is an UTF-8 encoded string. Format of
     * the JSON string is:
     * { appConfig: <UTF-8 encoded app configuration> }
     */
    onAppConfigUpdate: function(configDataStr) {
        // application code to handle change in application configuration goes here
        console.log("configDataStr"+configDataStr);
    },

    /* If passcode is enforced, this is called when the app is locked
     * and unlocked. isLocked is true, when container is locked and
     * false, otherwise
     */
    onContainerLockUpdate: function(isLocked) {
        // application code to handle container lock status goes here
        console.log("onContainerLockUpdate"+isLocked);
    },

    /* Called when device identity attributes change.
     * Applicable only for android platform.
     */
    onDeviceIdentityAttributesChange: function(deviceAttrInfoStr) {
        // application code to handle device identity change goes here
        console.log("onDeviceIdentityAttributesChange"+deviceAttrInfoStr);
    },

    /*
     * Called when policy information changes. The callback function 
     * is called with a parameter, policyInfo which is of JSON object
     * type. The JSON object has following keys:
     *
     * - policyname                 : name of the applied policy
     * - policyversion              : version of the applied policy
     * - shouldRestrictRootedDevice : a boolean value to restrict rooted devices
     * - saveAsAllowed              : a boolean value to allow exporting of files
     * - allowedFileTypes           : an array of allowed file types when file export is restricted
     * - whiteListedApps            : an array of application identifers to which file export is allowed
     * - copyPasteAllowed           : a boolean value to allow copy paste outside the application
     * - printAllowed               : a boolean value to allow print
     * - egEnabled                  : true, if enterprise gateway is enabled, otherwise false
     * - screenshotAllowed          : true, if screenshot capture is allowed, otherwise false (only available in Android)
     * - maas360egEnabled           : true, if MaaS360 enterprise gateway is enabled, otherwise false (only available in Android)
     */
    onPolicyInfoChange: function(policyInfo) {
        // application code to handle policy change goes here
        console.log("onPolicyInfoChange"+policyInfo);
    },

    /*
     * Called when security and compliance information changes.
     * The callback function is called with a JSON object which has 
     * following keys:
     * 
     * - policyCompliant            : a boolean to suggest if the application is in compliance or not
     * - oocReasons                 : an array of reasons for out of compliance state
     * - rooted                     : true, if the device is rooted/jailbroken, otherwise false
     * - passcodeComplianceStatus   : string to represent the passcode compliance status whose value 
     *                                can be {NOT_APPLICABLE, COMPLIANT, NOT_COMPLIANT}
     * - encryptionEnabled          : string to represent the encryption state whose value can be 
     *                                one of {NOT_APPLICABLE, ENABLED, DISABLED}
     */
    onSecurityInfoChange: function(securityInfo) {
        // application code to handle compliance change goes here
        console.log("onSecurityInfoChange"+securityInfo);
    },

    /*
     * Called when selective wipe status change.
     * The callback function is called with a string representing
     * a JSON object with following information:
     *
     * - blockContainer             : true, if app UI is blocked on selective wipe, otherwise false
     * - selectiveWipeReason        : a string value for the selective wipe reason
     * - wipeStatus                 : selective wipe status, the value can be one of
     *                              : {NOT_APPLIED, PENDING, APPLIED, REVOKED}
     */
    onSelectiveWipeStatusChange: function(wipeStatusString) {
        // application code to handle selective wipe change goes here
        console.log("onSelectiveWipeStatusChange"+wipeStatusString);
    },

    /*
     * Delegate method when user information changes
     * The callback function is called with a JSON object with following
     * information:
     *
     * - username                   : user name
     * - userDN                     : user domain
     * - groups                     : an array containing list of MaaS360 group identifiers 
     *                                to which the user belongs
     */
    onUserInfoChange: function(userInfo) {
        // application code to handle change in user information goes here
        console.log("onUserInfoChange"+userInfo);
    },

    /*
     * Delegate method which gets called when gateway connection status changes.
     * Applicable only if enterprise gateway is enabled.
     * The method is called with a callback function with a JSON object parameter.
     * The connection status can be queried using 'gatewayConnectionStatus' key and
     * the value can be one of {'Not Connected', Connected}
     */
    onGatewayConnectionStatusChange: function(result) {
        switch (result.gatewayConnectionStatus) {
            case 'Not Connected':
                // application code when gateway is not connected
                console.log("onGatewayConnectionStatusChange"+"Not Connected");
                break;
            case 'Connected':
                // application code when gateway is connected
                console.log("onGatewayConnectionStatusChange"+"Connected");
                break;
            default:
                // application code to handle other scenarios
                console.log("onGatewayConnectionStatusChange"+result.gatewayConnectionStatus);
        }
    }
  };



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
    this.isMobile = environment.isMobile;
  }

  ngOnInit() {
    this.appVersion = environment.version;
    this.buildDate = environment.buildDate
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        console.log(this.labels)
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
        //console.log('login position', position);
      });
    }

    // this.getRouteMap();
  }

  enter(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  login() {
    this.loginData = this.loginForm.value;      
    if (environment.hostingEnvironment === 'DEV') {
      this.loginData.email = `${this.loginData.email}@equitasbank.in`;
      this.loginData.useADAuth = false;
    } else if(environment.hostingEnvironment === 'UAT'){
      this.loginData.email = `${this.loginData.email}@esfbuat.in`;
      this.loginData.useADAuth = true;
    }else{
      this.loginData.email = `${this.loginData.email}@equitas.in`;
      this.loginData.useADAuth = true;
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

  

  initMaaS360() {
    let value = this.initM360SDKWithAnalytics(this.developerId, this.licenseKey, true, this.maas360sdkEventHandler);

    console.log("Maas360 value"+ value);
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


  initM360SDK(developerKey, licenseKey, eventHandler) {
    var sdkHandler = cordova.require('cordova-plugin-m360-sdk.SDKHandler');
    if (!eventHandler) {
        eventHandler = this.maas360sdkEventHandler;
    }

    sdkHandler.registerObserver(eventHandler);
    sdkHandler.init(developerKey, licenseKey);
  }

  /**
   * function to initialize MaaS360 Workplace SDK.
   * Input Parameters:
   * - developerKey : key provided to developer
   * - licenseKey   : MaaS360 SDK license key
   * - enableAnalytics   : Enable enableAnalytics
   */
  initM360SDKWithAnalytics(developerKey, licenseKey, enableAnalytics, eventHandler){
    var sdkHandler = cordova.require('cordova-plugin-m360-sdk.SDKHandler');

      if (!eventHandler) {
          eventHandler = this.maas360sdkEventHandler;
      }
      sdkHandler.registerObserver(eventHandler);
      sdkHandler.initWithAnalytics(developerKey, licenseKey, enableAnalytics);
  }

  getRouteMap(){
    var that = this;
    this.loginService.getPolyLine(function(result){
      that.base64Image = result;
     // console.log("getPolyLine", that.base64Image);
    }, null, null);
  }


}
