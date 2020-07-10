    var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');
    
    var VALID_API_CALL = '{"status" : "ValidApiCall"}';
    var UNSUPPORTED_API_CALL = '{"status" : "UnsupportedApiCall"}';

    var sdkPluginWrapper = null;
    
    var activationInfo = null;
    var selectiveWipeStatus = null;
    var policyInfo = null;
    var deviceSecurityInfo = null;
    var userInfo = null;
    var deviceIdentityAttributeInfo = null;
    var appConfig = null;
    var containerLockUpdate = null;
    
    var SDKPluginAndroid = {
               
        onEvent:function(event) {
            if  (!event)
               return;
               
            var eventId = event.eventId;
            var eventData = event.eventData;
            if (eventId === "SDKInfoUpdate") {
                for (var i=0; i< eventData.length; i++) {
                    
                    var internalEventId = eventData[i].eventId;
                    var internalEventData = eventData[i].eventData;

                    if (internalEventId === "ActivationStatusChange") {
                        var activationState = JSON.parse(internalEventData).activationState;
                        if(activationState != 'Activated' && activationState != 'ActivationInProgress'
                                        && activationState != 'Configuring') {
                         }

                        sdkPluginWrapper.notifyActivationStatusChange(internalEventData);
                        activationInfo = internalEventData;
                    }
                    else if (internalEventId === "SelectiveWipeStatusChange") {
                        selectiveWipeStatus = internalEventData;
                    }               
                    else if (internalEventId === "PolicyInfoChange") {
                        policyInfo = internalEventData;
                    }               
                    else if (internalEventId === "ComplianceInfoChange") {
                        deviceSecurityInfo = internalEventData;
                    }
                    else if (internalEventId === "UserInfoChange") {
                        userInfo = internalEventData;
                    }
                    else if (internalEventId === "DeviceIdentityAttributesChange") {
                        deviceIdentityAttributeInfo = internalEventData;
                    }
                    else if (internalEventId === "AppConfig") {
                        appConfig = internalEventData;
                    }
                    else if (internalEventId === "ContainerLockUpdate") {
                        containerLockUpdate = internalEventData;
                    }
                }                
            }
            else if (eventId === "EnterpriseGateway") {
                
                var status = eventData.status;
                
                if (status === "GatewayLoginComplete") {
                    sdkPluginWrapper.notifyGatewayLoginComplete();
                }
                else if (status === "GatewayLogoutComplete") {
                    sdkPluginWrapper.notifyGatewayLogoutComplete();
                }
                else if (status === "GatewayLoginCredentials") {
                    sdkPluginWrapper.notifyGatewayLoginCredentials();
                }
                else if (status == "GatewayLoginFailure") {
                    sdkPluginWrapper.notifyGatewayLoginFailure(eventData.reason);
                }
            }
            else if (eventId === "PolicyInfoChange") {
                    policyInfo = eventData;
                    sdkPluginWrapper.notifyPolicyInfoChange(policyInfo);
            }
            else if (eventId === "SelectiveWipeStatusChange") {
                    selectiveWipeStatus = eventData;
                    sdkPluginWrapper.notifySeleciveWipeStatusChange(selectiveWipeStatus);
             }
             else if (eventId === "ComplianceInfoChange") {
                 deviceSecurityInfo = eventData;
                 sdkPluginWrapper.notifySecurityInfoChange(deviceSecurityInfo);
             }
             else if (eventId === "UserInfoChange") {
                 userInfo = eventData;
                 sdkPluginWrapper.notifyUserInfoChange(userInfo);
             }
             else if (eventId === "DeviceIdentityAttributesChange") {
                 deviceIdentityAttributeInfo = eventData;
                 sdkPluginWrapper.notifyDeviceIdentityAttributesChange(deviceIdentityAttributeInfo);
             }
             else if (eventId === "AppConfig") {
                 appConfig = eventData;
                 sdkPluginWrapper.notifyAppConfigUpdate(appConfig);
             }
             else if (eventId === "ContainerLockUpdate") {
                 containerLockUpdate = eventData;
                 sdkPluginWrapper.notifyContainerLockUpdate(containerLockUpdate);
             }
        },
               
       initializeSDK:function(developerKey, licenseKey, delegate) {
            sdkPluginWrapper = delegate;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "initializeSDK", 
                    [developerKey, 
                     licenseKey,
                     this.shouldHandleRestriction("Copy-Paste"), 
                     this.shouldHandleRestriction("Single Sign On"), 
                     this.shouldHandleRestriction("Screenshot"), 
                     this.shouldHandleRestriction("Wipe"),
                     this.shouldHandleRestriction("Gateway"),
                     this.shouldHandleRestriction("File Export"),
                     this.shouldHandleRestriction("Restrict Rooted"),
                     this.shouldHandleRestriction("Restrict Import"),
                     this.shouldHandleRestriction("Restrict Print"),
                     this.shouldHandleRestriction("Restrict Share")
                     ]);
            return VALID_API_CALL;
       },

       initializeSDKWithAnalytics:function(developerKey, licenseKey, delegate, enableAnalytics) {
             sdkPluginWrapper = delegate;
             exec(this.onEvent, this.onEvent, "MaaS360SDK", "initializeSDK2",
                    [developerKey,
                     licenseKey,
                     this.shouldHandleRestriction("Copy-Paste"),
                     this.shouldHandleRestriction("Single Sign On"),
                     this.shouldHandleRestriction("Screenshot"),
                     this.shouldHandleRestriction("Wipe"),
                     this.shouldHandleRestriction("Gateway"),
                     this.shouldHandleRestriction("File Export"),
                     this.shouldHandleRestriction("Restrict Rooted"),
                     this.shouldHandleRestriction("Restrict Import"),
                     this.shouldHandleRestriction("Restrict Print"),
                     this.shouldHandleRestriction("Restrict Share"),
                     enableAnalytics
                    ]);
                   return VALID_API_CALL;
              },
       
       startEnterpriseGateway:function() {
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "startEnterpriseGateway", []);
            return VALID_API_CALL;
       },
       
       disconnectEnterpriseGateway:function() {
           exec(this.onEvent, this.onEvent, "MaaS360SDK", "disconnectEnterpriseGateway", []);
           return VALID_API_CALL;
       },
       
       refreshSDKInfo:function(context) {
            return UNSUPPORTED_API_CALL;
       },
    
       executeAction:function(actionInfo) {
            var methodName = null;
            
            if (actionInfo.actionType === "saveDoc") {
               methodName = "saveDocument";
               return UNSUPPORTED_API_CALL;
            }
            else if (actionInfo.actionType === "email") {
               methodName = "composeMail";
            }
            else if (actionInfo.actionType === "openURL") {
               methodName = "openURL";
            }
            else if (actionInfo.actionType === "refreshSDKInfo") {
                methodName = "refreshSDKInfo";
            }
            else if (actionInfo.actionType === "viewDocument") {
                methodName = "viewDocument";
            } 
            else if (actionInfo.actionType === "editDocument") {
                methodName = "editDocument";
            }
			else if(actionInfo.actionType === "printIn"){
                methodName = "printDocumentIn";
            } 
			else {
                return UNSUPPORTED_API_CALL;
            }
            exec(this.onEvent, this.onEvent, "MaaS360SDK", methodName, [actionInfo]);       
            return VALID_API_CALL;
       },
    
       getActivationInfo:function() {
            return activationInfo;
       },
       
       getPolicyInfo:function() {
            return policyInfo;
       },
       
       getSecurityInfo:function() {
            return deviceSecurityInfo;
       },
       
       getUserInfo:function() 
       {
            return userInfo;
       },
       
       getSelectiveWipeStatus:function()
       {
           return selectiveWipeStatus;
       },
       
       getDeviceIdentityAttributeInfo:function()
       {
           return deviceIdentityAttributeInfo;
       },
       
       getAppConfig:function()
       {
           return appConfig;
       },
       
       getContainerLockUpdate:function()
       {
           return containerLockUpdate;
       },
       
       shouldHandleRestriction:function(restrictionType) {           
           return true;
       },
        
       consoleLog:function(message) {
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "consoleLog", [message]);
       },

       encryptText:function(strToEncrypt, onEncryptionResult) {
           exec(function(r) {
               // Save result
               onEncryptionResult.call(this, r);
            }, function(r) {
               onEncryptionResult.call(this, r);
            }, "MaaS360SDK", "encryptText", [strToEncrypt]);
           return VALID_API_CALL;
       },
       decryptText:function(strToDecrypt, onDecryptionResult) {
           exec(function(r) {
               // Save result
               onDecryptionResult.call(this, r);
            }, function(r) {
               onDecryptionResult.call(this, r);
            }, "MaaS360SDK", "decryptText", [strToDecrypt]);
           return VALID_API_CALL;
       },
       writeEncryptedFile:function(fileName, textToWrite, onFileWriteComplete) {
           exec(this.onEvent, this.onEvent, "MaaS360SDK", "writeEncryptedFile", [{'fileName': fileName, 'textToWrite': textToWrite}], onFileWriteComplete)
           return VALID_API_CALL;
       }, 
       readEncryptedFile:function(fileName, onFileReadResult) {
           exec(function(r) {
               // Save result
               onFileReadResult.call(this, r);
            }, function(r) {
               onFileReadResult.call(this, r);
            }, "MaaS360SDK", "readEncryptedFile", [fileName]);
           return VALID_API_CALL;
       },
       encryptFileAtPath: function(filePath, onEncryptionComplete) {
    	   // Not Supported in Android
    	   return UNSUPPORTED_API_CALL;
       },
       decryptFileAtPath: function(filePath, onDecryptionComplete) {
    	   //Not supported in Android
    	   return UNSUPPORTED_API_CALL;
       },
       gatewayConnectionStatus:function(onGatewayStatusResult) {
           exec(function(r) {
               // Save result
        	   onGatewayStatusResult.call(this, r);
            }, function(r) {
               onGatewayStatusResult.call(this, r);
            }, "MaaS360SDK", "isGatewayConnected", []);
       },
       isGatewayEnabledInPolicy:function() {
            return JSON.parse(policyInfo).maas360egEnabled;
       },
       generateKey:function(resourceInfo, onKeyAvailable) {
    	   //KeyAvailable and KeyDestroyed are hard coded as it is default in Android
            exec(function(r) {
               // Save result
               onKeyAvailable.call(this, "KeyAvailable", r.keyInfo);
            }, function(r) {
               onKeyAvailable.call(this, "KeyDestroyed", null);
            }, "MaaS360SDK", "generateKey", [resourceInfo]);
       },
       getCertPinningInfo:function(onCertPinningInfoAvailable) {
           exec(function(r) {
               // Save result
        	   onCertPinningInfoAvailable.call(this, r);
            }, function(r) {
               onCertPinningInfoAvailable.call(this, r);
            }, "MaaS360SDK", "getCertPinningInfo", []);
       },
       printIn: function(elementId, documentNativeURL, documentName) {
           var rectForButton = document.getElementById(elementId).getBoundingClientRect();
           console.log("[Printing]Coordinates of the element are ", rectForButton.top, rectForButton.right, rectForButton.bottom,rectForButton.left);
           var rectForSending = {
              "XOffset": rectForButton.left,
              "YOffset": rectForButton.top,
              "width": rectForButton.width,
              "height": rectForButton.height
           };
           var eventInfo = {
              "actionType": "printIn",
              "filePath": documentNativeURL,
              "fileName": documentName,
              "buttonRect": rectForSending
           };
           this.executeAction(eventInfo);
       },
       printWithPages: function(elementId, documentNativeURL, documentName, totalPages) {
           var rectForButton = document.getElementById(elementId).getBoundingClientRect();
           console.log("[Printing]Coordinates of the element are ", rectForButton.top, rectForButton.right, rectForButton.bottom,rectForButton.left);
           var rectForSending = {
              "XOffset": rectForButton.left,
              "YOffset": rectForButton.top,
              "width": rectForButton.width,
              "height": rectForButton.height
           };
           var eventInfo = {
              "actionType": "printIn",
              "filePath": documentNativeURL,
              "fileName": documentName,
              "totalPages": totalPages,
              "buttonRect": rectForSending
           };
           this.executeAction(eventInfo);
       }
    };

    function receivedAction(response) {
       SDKPluginAndroid.onEvent(response.data);
    };
               
    module.exports = SDKPluginAndroid;
