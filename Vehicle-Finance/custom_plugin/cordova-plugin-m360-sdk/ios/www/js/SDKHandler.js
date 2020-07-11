    var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec'),
        sdkPluginWrapper = require('./SDKPluginWrapper'),
        sdkUIUtils = require('./SDKUIUtils');

    var selectiveWipeUIFlag = false;
    var oocReasonsUIFlag = false;
    var sdkEventDelegate = null;

    var sdkHandler = {

        registerObserver: function(eventDelegate) {
            sdkEventDelegate = eventDelegate;
        },

        init: function(developerKey, licenseKey) {
            sdkPluginWrapper.registerObserver(this);

            sdkPluginWrapper.initializeSDK({
                "developerKey": developerKey
            }, {
                "licenseKey": licenseKey
            });
            sdkUIUtils.initWithConfig("");
        },

        initWithAnalytics: function(developerKey, licenseKey, enableAnalytics) {
            sdkPluginWrapper.registerObserver(this);

            sdkPluginWrapper.initializeSDKWithAnalytics({
                "developerKey": developerKey
            }, {
                "licenseKey": licenseKey
            },{
               "enableAnalytics": enableAnalytics
             });
            sdkUIUtils.initWithConfig("");
        },

        onActivatonInProgress: function() {
            sdkUIUtils.presentModalScreenWithMessage('Activation In Progress', true);
            if (sdkEventDelegate) {
                sdkEventDelegate.onActivatonInProgress();
            }
        },

        getActivationInfo: function() {
            return sdkPluginWrapper.getActivationInfo();
        },

        onActivationStatusChange: function(activationInfoString) {
            var activationInfo = JSON.parse(activationInfoString);
            if (activationInfo.activationState === 'Activated') {
                sdkUIUtils.dismissUIEvent('NotInstalled');
                sdkUIUtils.dismissUIEvent('Enrolling');
                if (sdkPluginWrapper.shouldHandleRestriction("Gateway")) {
                    sdkPluginWrapper.startEnterpriseGateway(null);
                }
            } else if (activationInfo.activationState === 'NotRelevant') {
                sdkUIUtils.dismissUIEvent('NotInstalled');
                sdkUIUtils.dismissUIEvent('Enrolling');
            } else {
                sdkUIUtils.processUIEvent(activationInfo.activationState, '');
            }

            if (sdkEventDelegate) {
                sdkEventDelegate.onActivationStatusChange(activationInfoString);
            }
        },

        getAppConfig: function() {
            return sdkPluginWrapper.getAppConfig();
        },

        onAppConfigUpdate: function(configDataStr) {
            if (sdkEventDelegate) {
                sdkEventDelegate.onAppConfigUpdate(configDataStr);
            }
        },

        getContainerLockUpdate: function() {
            return sdkPluginWrapper.getContainerLockUpdate();
        },

        onContainerLockUpdate: function(isLocked) {
            if (sdkEventDelegate) {
                sdkEventDelegate.onContainerLockUpdate(isLocked);
            }
        },

        getDeviceIdentityAttributeInfo: function() {
            return sdkPluginWrapper.getDeviceIdentityAttributeInfo();
        },

        onDeviceIdentityAttributesChange: function(deviceIdentityAttributesStr) {},

        getPolicyInfo: function() {
            return sdkPluginWrapper.getPolicyInfo();
        },

        onPolicyInfoChange: function(policyInfo) {
            if (sdkEventDelegate) {
                sdkEventDelegate.onPolicyInfoChange(policyInfo);
            }
        },

        getSecurityInfo: function() {
            return sdkPluginWrapper.getSecurityInfo();
        },

        onSecurityInfoChange: function(securityInfo) {
            if (securityInfo.rooted) {
                oocReasonsUIFlag = true;
                sdkUIUtils.processUIEvent('Compliance', securityInfo.oocReasons);
            } else {
                oocReasonsUIFlag = false;
                sdkUIUtils.dismissUIEvent('Compliance');
            }

            if (sdkEventDelegate) {
                sdkEventDelegate.onSecurityInfoChange(securityInfo);
            }
        },

        getSelectiveWipeStatus: function() {
            return sdkPluginWrapper.getSelectiveWipeStatus();
        },

        onSelectiveWipeStatusChange: function(wipeStatusString) {
            var wipeStatus = JSON.parse(wipeStatusString);
            if (sdkPluginWrapper.shouldHandleRestriction("Wipe")) {
                if (wipeStatus.wipeStatus === 'APPLIED') {
                    if (!selectiveWipeUIFlag && !oocReasonsUIFlag) {
                        selectiveWipeUIFlag = true;
                        sdkUIUtils.processUIEvent('Wipe', 'Business Wipe has been enforced on this device');
                    }
                } else {
                    sdkUIUtils.dismissUIEvent('Wipe');
                    selectiveWipeUIFlag = false;
                }
            }

            if (sdkEventDelegate) {
                sdkEventDelegate.onSelectiveWipeStatusChange(wipeStatusString);
            }
        },

        getUserInfo: function() {
            return sdkPluginWrapper.getUserInfo();
        },

        onUserInfoChange: function(userInfo) {
            if (sdkEventDelegate) {
                sdkEventDelegate.onUserInfoChange(userInfo);
            }
        },

        executeAction: function(actionInfo) {
            var result = sdkPluginWrapper.executeAction(actionInfo);
            if (console && console.log) {
                if (result.status === "UnsupportedAPICall") {
                    console.log(result.status + ": " + result.reason);
                }
            }
            return result;
        },

        openIn: function(elementId, documentNativeURL, documentName) {
            sdkPluginWrapper.openIn(elementId, documentNativeURL, documentName);
        },

        printIn: function(elementId, documentNativeURL, documentName) {
            sdkPluginWrapper.printIn(elementId, documentNativeURL, documentName);
        },

        printWithPages: function(elementId, documentNativeURL, documentName, totalPages) {
           // This API is added for Android as Android Native require page numbers for pdf printing.
           // So for iOS calling the default printIn API of sdkPluginWrapper without total pages arguement
           sdkPluginWrapper.printIn(elementId, documentNativeURL, documentName);
        },

        // Gateway related API
        isGatewayEnabledInPolicy: function() {
            return sdkPluginWrapper.isGatewayEnabledInPolicy();
        },

        gatewayConnectionStatus: function(onGatewayStatusResult) {
            sdkPluginWrapper.gatewayConnectionStatus(onGatewayStatusResult);
        },

        onGatewayLoginComplete: function() {
            sdkUIUtils.dismissUIEvent('Gateway');
        },

        onGatewayLoginFailure: function(reason) {
            if (console && console.log) {
                console.log("Gateway login failed [Reason: " + reason + "]");
            }
            sdkUIUtils.removeLoadingGIF();
        },

        onGatewayLoginCredentials: function() {
            sdkUIUtils.processUIEvent('Gateway', '');
        },

        // Encryption API
        generateKey: function(resourceInfo, onKeyAvailable) {
            return sdkPluginWrapper.generateKey(resourceInfo, onKeyAvailable);
        },

        encryptText: function(strToEncrypt, onEncryptionResult) {
            return sdkPluginWrapper.encryptText(strToEncrypt, onEncryptionResult);
        },

        decryptText: function(strToDecrypt, onDecryptionResult) {
            return sdkPluginWrapper.decryptText(strToDecrypt, onDecryptionResult);
        },

        writeEncryptedFile: function(fileName, textToWrite, onFileWriteComplete) {
            return sdkPluginWrapper.writeEncryptedFile(fileName, textToWrite, onFileWriteComplete);
        },

        readEncryptedFile: function(fileName, onFileReadResult) {
            return sdkPluginWrapper.readEncryptedFile(fileName, onFileReadResult);
        },

        encryptFileAtPath: function(filePath, onEncryptionComplete) {
            return sdkPluginWrapper.encryptFileAtPath(filePath, onEncryptionComplete);
        },

        decryptFileAtPath: function(filePath, onDecryptionComplete) {
            return sdkPluginWrapper.decryptFileAtPath(filePath, onDecryptionComplete);
        },

        // Certificate API
        getCertPinningInfo: function(onCertPinningInfoAvailable) {
            return sdkPluginWrapper.getCertPinningInfo(onCertPinningInfoAvailable);
        }
    };

    module.exports = sdkHandler;
