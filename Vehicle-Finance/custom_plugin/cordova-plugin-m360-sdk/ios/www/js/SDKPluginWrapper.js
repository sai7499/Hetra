    var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec');

    var sdkEventDelegate = null;

    var sdkPluginInternal = {

        getInstance: function() {
            if (window.device.platform === "Android") {
                return require('./SDKPluginAndroid');
            } else {
                return require('./SDKPluginIOS');
            }
        }
    };

    var sdkPluginWrapper = {

        initializeSDK: function(developerKey, licenseKey) {
            return sdkPluginInternal.getInstance().initializeSDK(developerKey, licenseKey, this);
        },

        initializeSDKWithAnalytics: function(developerKey, licenseKey, enableAnalytics) {
            return sdkPluginInternal.getInstance().initializeSDKWithAnalytics(developerKey, licenseKey, enableAnalytics, this);
        },

        registerObserver: function(eventDelegate) {
            sdkEventDelegate = eventDelegate;
        },

        // Information API
        getActivationInfo: function() {
            return sdkPluginInternal.getInstance().getActivationInfo();
        },

        getAppConfig: function() {
            return sdkPluginInternal.getInstance().getAppConfig();
        },

        getContainerLockUpdate: function() {
            return sdkPluginInternal.getInstance().getContainerLockUpdate();
        },

        getDeviceIdentityAttributeInfo: function() {
            return sdkPluginInternal.getInstance().getDeviceIdentityAttributeInfo();
        },

        getPolicyInfo: function() {
            return sdkPluginInternal.getInstance().getPolicyInfo();
        },

        getSecurityInfo: function() {
            return sdkPluginInternal.getInstance().getSecurityInfo();
        },

        getSelectiveWipeStatus: function() {
            return sdkPluginInternal.getInstance().getSelectiveWipeStatus();
        },

        getUserInfo: function() {
            return sdkPluginInternal.getInstance().getUserInfo();
        },

        isGatewayEnabledInPolicy: function() {
            return sdkPluginInternal.getInstance().isGatewayEnabledInPolicy();
        },

        shouldHandleRestriction: function(restrictionType) {
            return sdkPluginInternal.getInstance().shouldHandleRestriction(restrictionType);
        },

        // Action API
        executeAction: function(actionInfo) {
            return sdkPluginInternal.getInstance().executeAction(actionInfo);
        },

        openIn: function(elementId, documentNativeURL, documentName) {
            sdkPluginInternal.getInstance().openIn(elementId, documentNativeURL, documentName);
        },

        printIn: function(elementId, documentNativeURL, documentName) {
            sdkPluginInternal.getInstance().printIn(elementId, documentNativeURL, documentName);
        },

        startEnterpriseGateway: function(loginInfo) {
            return sdkPluginInternal.getInstance().startEnterpriseGateway(loginInfo);
        },

        disconnectEnterpriseGateway: function() {
            return sdkPluginInternal.getInstance().disconnectEnterpriseGateway();
        },

        // Event API
        notifyActivationInProgress: function() {
            sdkEventDelegate.onActivatonInProgress();
        },

        notifyActivationStatusChange: function(activationInfo) {
            sdkEventDelegate.onActivationStatusChange(activationInfo);
        },

        notifyAppConfigUpdate: function(appConfig) {
            sdkEventDelegate.onAppConfigUpdate(appConfig);
        },

        notifyContainerLockUpdate: function(isLocked) {
            sdkEventDelegate.onContainerLockUpdate(isLocked);
        },

        // Not Implemented in iOS
        notifyDeviceIdentityAttributesChange: function(deviceIdentityAttributes) {
            sdkEventDelegate.onDeviceIdentityAttributesChange(deviceIdentityAttributes);
        },

        notifyGatewayLoginCredentials: function() {
            sdkEventDelegate.onGatewayLoginCredentials();
        },

        notifyGatewayLoginComplete: function() {
            sdkEventDelegate.onGatewayLoginComplete();
        },

        notifyGatewayLoginFailure: function(reason) {
            sdkEventDelegate.onGatewayLoginFailure(reason);
        },

        notifyPolicyInfoChange: function(policyInfo) {
            sdkEventDelegate.onPolicyInfoChange(JSON.parse(policyInfo));
        },

        notifySecurityInfoChange: function(securityInfo) {
            sdkEventDelegate.onSecurityInfoChange(JSON.parse(securityInfo));
        },

        notifySeleciveWipeStatusChange: function(wipeStatus) {
            sdkEventDelegate.onSelectiveWipeStatusChange(wipeStatus);
        },

        notifyUserInfoChange: function(userInfo) {
            sdkEventDelegate.onUserInfoChange(JSON.parse(userInfo));
        },

        // Info + Event API
        gatewayConnectionStatus: function(onGatewayStatusResult) {
            sdkPluginInternal.getInstance().gatewayConnectionStatus(onGatewayStatusResult);
        },

        getCertPinningInfo: function(onCertPinningInfoAvailable) {
            sdkPluginInternal.getInstance().getCertPinningInfo(onCertPinningInfoAvailable);
        },

        // Encryption API
        generateKey: function(resourceInfo, onKeyAvailable) {
            return sdkPluginInternal.getInstance().generateKey(resourceInfo, onKeyAvailable);
        },

        encryptText: function(strToEncrypt, onEncryptionResult) {
            return sdkPluginInternal.getInstance().encryptText(strToEncrypt, onEncryptionResult);
        },

        decryptText: function(strToDecrypt, onDecryptionResult) {
            return sdkPluginInternal.getInstance().decryptText(strToDecrypt, onDecryptionResult);
        },

        writeEncryptedFile: function(fileName, textToWrite, onFileWriteComplete) {
            return sdkPluginInternal.getInstance().writeEncryptedFile(fileName, textToWrite, onFileWriteComplete);
        },

        readEncryptedFile: function(fileName, onFileReadResult) {
            return sdkPluginInternal.getInstance().readEncryptedFile(fileName, onFileReadResult);
        },

        encryptFileAtPath: function(filePath, onEncryptionComplete) {
            return sdkPluginInternal.getInstance().encryptFileAtPath(filePath, onEncryptionComplete);
        },

        decryptFileAtPath: function(filePath, onDecryptionComplete) {
            return sdkPluginInternal.getInstance().decryptFileAtPath(filePath, onDecryptionComplete);
        },

        // iOS Functions
        getAllInfo: function() {
            return sdkPluginInternal.getInstance().getAllInfo();
        },

        isEnterpriseGatewayActive: function() {
            return sdkPluginInternal.getInstance().isEnterpriseGatewayActive();
        },

        isBrowserActive: function() {
            return sdkPluginInternal.getInstance().isBrowserActive();
        },

        openDocument: function(docInfo) {
            return sdkPluginInternal.getInstance().openDocument(docInfo);
        }
    };

    module.exports = sdkPluginWrapper;
