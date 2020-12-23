import { environment } from '../environments/environment';
import { Component, OnInit,HostListener, OnDestroy } from '@angular/core';


declare var cordova:any;

// declare var channel:any

import { DraggableContainerService } from '@services/draggable.service';
import { Router,NavigationStart,NavigationEnd } from '@angular/router';
import { UtilityService } from '@services/utility.service';
import {SharedService} from './modules/shared/shared-service/shared-service'
import { filter } from 'rxjs/operators'
import { IdleTimerService } from '@services/idle-timer.service';
import value from '*.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, OnDestroy {
  sessionIntervalId;
  timer = 0;
  showTimerModal: boolean;
  showExpiryModal: boolean;
  title = 'vehicle-finance';
  isMaas360Enabled:any;

  showConfirmFlag: boolean;
  showModal: boolean;

  imageList = [];
  imageObj = {};
  minimizeList = [];


  // Equitas

  developerId = "40026336";

  licenseKey = "7669E-A668C-99CJ8-B9EJJ-JJJJJ-J3C42";

 //Test
//  developerId = "0040035464";

//  licenseKey = "7669E-A669B-ACAJE-9EFJJ-JJJJJ-JFCC7";

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


   

  showDraggableContainer: {
    imageUrl: string;
    imageType: string;
  };
  setCss = {
    top: '',
    left: '',
  };

  constructor(private draggableContainerService: DraggableContainerService,
              private router: Router,private utilityService: UtilityService,private sharedService: SharedService, private idleTimerService: IdleTimerService) {}

  ngOnInit() {

    this.timer = this.idleTimerService.getModalTimer();


    this.idleTimerService.getTimerObservable()
      .subscribe((value) => {
        if(value) {

          this.showTimerModal = true;
          this.sessionIntervalId = setInterval(() => {

            console.log('timer 2')

            this.timer -= 1;

            if (this.timer <= 0) {
                this.showTimerModal = false;
                this.timer = this.idleTimerService.getModalTimer();

                clearInterval(this.sessionIntervalId);
                // this.logout();
                this.showExpiryModal = true;
            }

          }, 1000);
        }
      })

    let that = this;

    this.isMaas360Enabled = environment.isMaas360Enabled;
    if(this.isMaas360Enabled) {
        that.initMaaS360();
    }
    
    this.draggableContainerListener();
    this.getMinimizeList();
    this.clearListener();
    document.addEventListener('backbutton', () => {
      navigator['app'].exitApp();
    });

    document.addEventListener(
      'offline',
      () => {
        alert('No internet connection');
      },
      false
    );
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
           let token = localStorage.getItem('token');
           if(token == undefined) { 
             // Perform logout
             //Navigate to login/home
              this.router.navigate(['/login']); 
           }
      }
  });

  window.addEventListener('popstate', (event) => {
    if(!window.location.href.includes('/login') && localStorage.getItem('token') && environment.production) {
          history.go(1);
          this.sharedService.browserPopState(false);
          this.showModal = false;
          setTimeout(()=> {
            this.showModal = true;
          },200)
          
    }
  });

      window.addEventListener('unload',(event)=> {
        if(environment.production) {
        this.utilityService.logOut();
        }
      })
    
      window.addEventListener('beforeunload', (event) => {
        if(environment.production) {
        if(!window.location.href.includes('/login')) {
            event.preventDefault()
            event.returnValue = ""
            return false;
        }
      }
      });

  }

  clearListener() {
    this.draggableContainerService
      .getClearListener()
      .subscribe((value) => {
          if (value) {
            this.minimizeList = [];
            this.imageList = [];
            this.imageObj = {};
          }
      });
  }

  getMinimizeList() {
    this.draggableContainerService
        .getMinimizeList()
        .subscribe((value) => {
            if(!value) {
              return;
            }
            const index = this.minimizeList.findIndex(list => list.name === value.name);
            if (index !== -1) {
              return;
            }
            this.minimizeList.push(value);
        });
  }

  removeMinimizeList(list) {
    const index = this.minimizeList.findIndex(value => value.name === list.name);
    this.minimizeList.splice(index, 1);
  }

  openImage(list) {
     this.imageList.push(list);
     this.removeMinimizeList(list);
  }


  draggableContainerListener() {
    this.draggableContainerService
      .getContainerValue()
      .subscribe((value: any) => {
        if (!value) {
          return;
        }
        const imageName = value.image.name;
        if (!this.imageList[imageName]) {
          this.imageObj[imageName] = {...value.image};
          this.imageList.push(value.image);
        }
        console.log(this.imageObj);

        this.showDraggableContainer = value.image;
        this.setCss = value.css;
      });

    this.draggableContainerService
      .imageRemoveListener()
      .subscribe((value: any) => {
        if (value === null) {
          return;
        }
        this.removeImage(value);
      });
  }

  removeImage(fileName: string) {
    delete this.imageObj[fileName];
    this.imageList = [];
    for ( const [key, image] of Object.entries(this.imageObj)) {
        this.imageList.push(image);
    }
  }

  @HostListener('window:mousemove') refreshUserState() {
  
    setTimeout(()=> {
      this.showConfirmFlag = false;;
      this.sharedService.browserPopState(true)
      })
  }

  initMaaS360() {
    let value = this.initM360SDKWithAnalytics(this.developerId, this.licenseKey, true, this.maas360sdkEventHandler);

    console.log("Maas360 value"+ value);
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

  onOkay(event) {
    this.showModal =false;
    this.utilityService.logOut()
  }

  stay() {
    this.showTimerModal = false;
    this.timer = this.idleTimerService.getModalTimer(); // seconds (2mins)
    clearInterval(this.sessionIntervalId);
    this.idleTimerService.againAddTimer();
  }

  logout() {
    this.showExpiryModal = false;
    this.utilityService.logOut();
    this.timer = this.idleTimerService.getModalTimer();
    clearInterval(this.sessionIntervalId);
    this.showTimerModal = false;
  }

  ngOnDestroy() {
    this.idleTimerService.cleanUp();
    clearInterval(this.sessionIntervalId);
  }
}
