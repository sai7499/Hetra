    var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec'),
        sdkPluginWrapper = require('./SDKPluginWrapper'),
        sdkUIUtils = require('./SDKUIUtils');

	var sdkEventDelegate = null;
    var sdkHandler = {
        
	   registerObserver: function(eventDelegate) {
            sdkEventDelegate = eventDelegate;
       },
	   
       init:function(developerKey, licenseKey) {
           sdkPluginWrapper.initializeSDK({"developerKey": developerKey }, { "licenseKey" : licenseKey});
           sdkPluginWrapper.registerObserver(this);
           sdkUIUtils.initWithConfig("css/MaaS360SDK.css");
       },

       initWithAnalytics:function(developerKey, licenseKey, enableAnalytics) {
            sdkPluginWrapper.initializeSDKWithAnalytics({"developerKey": developerKey }, { "licenseKey" : licenseKey}, { "enableAnalytics" : enableAnalytics});
            sdkPluginWrapper.registerObserver(this);
            sdkUIUtils.initWithConfig("css/MaaS360SDK.css");
       },
       
       onActivatonInProgress:function() {
           sdkUIUtils.presentModalScreenWithMessage('Activation In Progress', true);
		   if (sdkEventDelegate) {
                sdkEventDelegate.onActivatonInProgress();
           };
       },
       
       onActivationStatusChange:function(activationInfoString) {
           sdkUIUtils.dismissModalScreen();
           var activationState = JSON.parse(activationInfoString).activationState;
           if  (activationState === 'Activated') {
                var policy = sdkPluginWrapper.getPolicyInfo();
                if (sdkPluginWrapper.shouldHandleRestriction("Gateway") == 1 && (JSON.parse(policy).egEnabled)) {
                    this.onGatewayLoginCredentials();
                }
            }
            else if (activationState === 'ActivationInProgress') {
                    sdkUIUtils.presentModalScreenWithMessage('Activation In Progress', true);
            }
            else if (activationState === 'Configuring') {
                    sdkUIUtils.presentModalScreenWithMessage(activationState, true);
            }
            else if (activationState === 'SDKActivationBlocked') {
                    var blockedReason = JSON.parse(activationInfoString).failureReason;
                    sdkUIUtils.presentModalScreenWithMessage(blockedReason, true);
            }
            else {
                  sdkUIUtils.presentModalScreenWithMessage(activationState, false);
            }
			
			if (sdkEventDelegate) {
                sdkEventDelegate.onActivationStatusChange(activationInfoString);
			}
       },
       
       onGatewayLoginComplete:function() {
               sdkUIUtils.dismissModalScreen();
       },
       
       onGatewayLoginFailure:function(reason) {
               sdkUIUtils.dismissModalScreen();
       },

       onGatewayLogoutComplete:function() {
       },
    
       onGatewayLoginCredentials:function() {
    	   var policy = sdkPluginWrapper.getPolicyInfo();
    	   if(JSON.parse(policy).maas360egEnabled) {
    		   sdkPluginWrapper.startEnterpriseGateway(null);
    	   }
       },
       
       onSelectiveWipeStatusChange:function(wipeStatusString) {
           var status = JSON.parse(wipeStatusString);
           if (sdkPluginWrapper.shouldHandleRestriction("Wipe") == 1) {
               if (status.wipeStatus === 'APPLIED' && status.blockContainer) {
                   sdkUIUtils.presentModalScreenWithMessage('Selective Wipe Applied', false);
               }
               else {
                   sdkUIUtils.dismissModalScreen();
               }
			   if (sdkEventDelegate) {
				   sdkEventDelegate.onSelectiveWipeStatusChange(wipeStatusString);
			   }
           }
       },
       
       onPolicyInfoChange:function(policyInfo) {
		   if (sdkEventDelegate) {
                sdkEventDelegate.onPolicyInfoChange(policyInfo);
           }
       },
       
       onSecurityInfoChange:function(securityInfo) {
		   if (sdkEventDelegate) {
                sdkEventDelegate.onSecurityInfoChange(securityInfo);
           }
       },
       
       onUserInfoChange:function(userInfo) {
		   if (sdkEventDelegate) {
                sdkEventDelegate.onUserInfoChange(userInfo);
           }
       },
       
       getActivationInfo:function() {
           return sdkPluginWrapper.getActivationInfo();
       },
       
       getPolicyInfo:function() {
           return sdkPluginWrapper.getPolicyInfo();
       },
       
       getSecurityInfo:function() {
           return sdkPluginWrapper.getSecurityInfo();
       },
       
       getUserInfo:function() {
           return sdkPluginWrapper.getUserInfo();
       },
       
       getDeviceIdentityAttributeInfo:function() {
           return sdkPluginWrapper.getDeviceIdentityAttributeInfo();
       },
       
       getAppConfig:function() {
           return sdkPluginWrapper.getAppConfig();
       },
       
       getContainerLockUpdate:function() {
           return sdkPluginWrapper.getContainerLockUpdate();
       },
       
       onDeviceIdentityAttributesChange:function(deviceIdentityAttributes) {
		   if (sdkEventDelegate) {
                sdkEventDelegate.onDeviceIdentityAttributesChange(deviceIdentityAttributes);
           }
       },
       
       onAppConfigUpdate:function(configData) {
		   if (sdkEventDelegate) {
                sdkEventDelegate.onAppConfigUpdate(configData);
           }
       },
       
       onContainerLockUpdate:function(isLocked) {
		   if (sdkEventDelegate) {
                sdkEventDelegate.onContainerLockUpdate(isLocked);
           }
       },
       
       getSelectiveWipeStatus:function() {
          return sdkPluginWrapper.getSelectiveWipeStatus();
       },
        
       executeAction:function(actionInfo) {
          var result = sdkPluginWrapper.executeAction(actionInfo);
          if  (result.status === "UnsupportedAPICall")
           {
              alert(result.status + "\n" + result.reason);
           }
       },
        
       encryptText:function(strToEncrypt, onEncryptionResult) {
          return sdkPluginWrapper.encryptText(strToEncrypt, onEncryptionResult);
       },
       decryptText:function(strToDecrypt, onDecryptionResult) {
          return sdkPluginWrapper.decryptText(strToDecrypt, onDecryptionResult);
       },
       writeEncryptedFile:function(fileName, textToWrite, onFileWriteComplete) {
          return sdkPluginWrapper.writeEncryptedFile(fileName, textToWrite, onFileWriteComplete);
       },
       readEncryptedFile:function(fileName, onFileReadResult) {
          return sdkPluginWrapper.readEncryptedFile(fileName, onFileReadResult);
       },
       encryptFileAtPath: function(filePath, onEncryptionComplete) {
    	   // Not Supported in Android
    	   return sdkPluginWrapper.encryptFileAtPath(filePath, onEncryptionComplete);
       },
       decryptFileAtPath: function(filePath, onDecryptionComplete) {
    	   //Not supported in Android
    	   return sdkPluginWrapper.decryptFileAtPath(filePath, onDecryptionComplete);
       },
       gatewayConnectionStatus:function(onGatewayStatusResult) {
           sdkPluginWrapper.gatewayConnectionStatus(onGatewayStatusResult);
       },
       isGatewayEnabledInPolicy:function() {
           return sdkPluginWrapper.isGatewayEnabledInPolicy();
       },
       generateKey:function(resourceInfo, onKeyAvailable){
           return sdkPluginWrapper.generateKey(resourceInfo, onKeyAvailable);
       },
       getCertPinningInfo:function(onCertPinningInfoAvailable) {
       	   sdkPluginWrapper.getCertPinningInfo(onCertPinningInfoAvailable);
       },
	   printIn: function(elementId, documentNativeURL, documentName) {
            sdkPluginWrapper.printIn(elementId, documentNativeURL, documentName);
       },
       printWithPages: function(elementId, documentNativeURL, documentName, totalPages) {
           sdkPluginWrapper.printWithPages(elementId, documentNativeURL, documentName, totalPages);
       }
    };

    module.exports = sdkHandler;
