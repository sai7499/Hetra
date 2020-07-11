    var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');
   
    var sdkEventDelegate = null;
    
    var sdkPluginInternal = {
    
        getInstance:function() {
        //    if (device.platform === "Android") {
        //        return require('./SDKPluginAndroid');
        //    }
        //    else {
        //        return require('./SDKPluginIOS');
        //    }
           return require('./SDKPluginAndroid');
        }    
    };
   
    var sdkPluginWrapper = {

       initializeSDK:function(developerKey, licenseKey) {
           return sdkPluginInternal.getInstance().initializeSDK(developerKey, licenseKey, this);
       },

       initializeSDKWithAnalytics:function(developerKey, licenseKey, enableAnalytics) {
           return sdkPluginInternal.getInstance().initializeSDKWithAnalytics(developerKey, licenseKey, this, enableAnalytics);
       },
       
       startEnterpriseGateway:function() {
           return sdkPluginInternal.getInstance().startEnterpriseGateway();
       },
       
       disconnectEnterpriseGateway:function() {
           return sdkPluginInternal.getInstance().disconnectEnterpriseGateway();
       },
       
       registerObserver:function(eventDelegate) {
           sdkEventDelegate = eventDelegate;
       },
        
       shouldHandleRestriction:function(restrictionType) {
           return sdkPluginInternal.getInstance().shouldHandleRestriction(restrictionType);
       },
       
       getActivationInfo:function() {
           return sdkPluginInternal.getInstance().getActivationInfo();
       },
       
       getPolicyInfo:function() {
           return sdkPluginInternal.getInstance().getPolicyInfo();
       },
       
       getSecurityInfo:function() {
           return sdkPluginInternal.getInstance().getSecurityInfo();
       },
       
       getUserInfo:function() {
           return sdkPluginInternal.getInstance().getUserInfo();
       },
       
       getDeviceIdentityAttributeInfo:function() {
           return sdkPluginInternal.getInstance().getDeviceIdentityAttributeInfo();
       },
       
       getAppConfig:function() {
           return sdkPluginInternal.getInstance().getAppConfig();
       },
       
       getContainerLockUpdate:function() {
           return sdkPluginInternal.getInstance().getContainerLockUpdate();
       },
       
       getSelectiveWipeStatus:function() {
           return sdkPluginInternal.getInstance().getSelectiveWipeStatus();
       },
       
       executeAction:function(actionInfo) {
           return sdkPluginInternal.getInstance().executeAction(actionInfo);
       },
       
       notifyActivationInProgress:function() {
           sdkEventDelegate.onActivatonInProgress();
       },
       
       notifyActivationStatusChange:function(activationInfo) {
           sdkEventDelegate.onActivationStatusChange(activationInfo);
       },
       
       notifyGatewayLoginComplete:function() {
           sdkEventDelegate.onGatewayLoginComplete();
       },

       notifyGatewayLogoutComplete:function() {
           sdkEventDelegate.onGatewayLogoutComplete();
       },
       
       notifyGatewayLoginFailure:function(reason) {
           sdkEventDelegate.onGatewayLoginFailure(reason);
       },
       
       notifyGatewayLoginCredentials:function() {
            sdkEventDelegate.onGatewayLoginCredentials();
       },
       
       notifySeleciveWipeStatusChange:function(wipeStatus) {
           sdkEventDelegate.onSelectiveWipeStatusChange(wipeStatus);
       },
       
       notifyPolicyInfoChange:function(policyInfo) {
           sdkEventDelegate.onPolicyInfoChange(policyInfo);
       },
       
       notifySecurityInfoChange:function(securityInfo) {
           sdkEventDelegate.onSecurityInfoChange(securityInfo);
       },
       
       notifyUserInfoChange:function(userInfo) {
           sdkEventDelegate.onUserInfoChange(userInfo);
       },
       
       notifyDeviceIdentityAttributesChange:function(deviceIdentityAttributes) {
           sdkEventDelegate.onDeviceIdentityAttributesChange(deviceIdentityAttributes);
       },
       
       notifyAppConfigUpdate:function(appConfig) {
           sdkEventDelegate.onAppConfigUpdate(appConfig);
       },
       
       notifyContainerLockUpdate:function(isLocked) {
           sdkEventDelegate.onContainerLockUpdate(isLocked);
       },

       encryptText:function(strToEncrypt, onEncryptionResult) {
            return sdkPluginInternal.getInstance().encryptText(strToEncrypt, onEncryptionResult);
       },
       decryptText:function(strToDecrypt, onDecryptionResult) {
           return sdkPluginInternal.getInstance().decryptText(strToDecrypt, onDecryptionResult);
       },
       writeEncryptedFile:function(fileName, textToWrite, onFileWriteComplete) {
           return sdkPluginInternal.getInstance().writeEncryptedFile(fileName, textToWrite, onFileWriteComplete);
       },
       readEncryptedFile:function(fileName, onFileReadResult) {
    	   return sdkPluginInternal.getInstance().readEncryptedFile(fileName, onFileReadResult);
       },
       encryptFileAtPath: function(filePath, onEncryptionComplete) {
    	   // Not Supported in Android
    	   return sdkPluginInternal.getInstance().encryptFileAtPath(filePath, onEncryptionComplete);
       },
       decryptFileAtPath: function(filePath, onDecryptionComplete) {
    	   //Not supported in Android
    	   return sdkPluginInternal.getInstance().decryptFileAtPath(filePath, onDecryptionComplete);
       },
       gatewayConnectionStatus:function(onGatewayStatusResult) {
    	   sdkPluginInternal.getInstance().gatewayConnectionStatus(onGatewayStatusResult);
       },
       isGatewayEnabledInPolicy:function() {
           return sdkPluginInternal.getInstance().isGatewayEnabledInPolicy();
       },
       generateKey:function(resourceInfo, onKeyAvailable) {
           return sdkPluginInternal.getInstance().generateKey(resourceInfo, onKeyAvailable);
       },
       getCertPinningInfo:function(onCertPinningInfoAvailable) {
       	   sdkPluginInternal.getInstance().getCertPinningInfo(onCertPinningInfoAvailable);
       },
	   printIn: function(elementId, documentNativeURL, documentName) {
            sdkPluginInternal.getInstance().printIn(elementId, documentNativeURL, documentName);
       },
       printWithPages: function(elementId, documentNativeURL, documentName, totalPages) {
    	   sdkPluginInternal.getInstance().printWithPages(elementId, documentNativeURL, documentName, totalPages);
       }
    };
   
    module.exports = sdkPluginWrapper;
