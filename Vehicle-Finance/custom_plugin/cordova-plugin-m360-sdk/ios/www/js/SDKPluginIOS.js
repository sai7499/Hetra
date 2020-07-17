    var argscheck = require('cordova/argscheck'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec');

    var VALID_API_CALL = '{"status": "ValidAPICall"}';
    var UNSUPPORTED_API_CALL = '{"status" : "UnsupportedApiCall"}';
    var EMPTY_JSON_STR = '{}';

    var sdkInfo = null;
    var appConfig = null;
    var sdkInfoRefreshPendingEvents = [];

    var sdkPluginWrapper = null;

    var generateKeyCallBackPointersMap = {};
    var encryptTextCallBackPointersMap = {};
    var decryptTextCallBackPointersMap = {};
    var encryptFileCallBackPointersMap = {};
    var decryptFileCallBackPointersMap = {};
    var encryptFileAtPathCBPointersMap = {};
    var decryptFileAtPathCBPointersMap = {};

    var gatewayConnectionStatusPointer;

    function encryptTextCallBackPointerId() {
        encryptTextCallBackPointerId.counter = ++encryptTextCallBackPointerId.counter || 1;
        return encryptTextCallBackPointerId.counter.toString();
    }

    function decryptTextCallBackPointerId() {
        decryptTextCallBackPointerId.counter = ++decryptTextCallBackPointerId.counter || 1;
        return decryptTextCallBackPointerId.counter.toString();
    }

    function encryptFileCallBackPointerId() {
        encryptFileCallBackPointerId.counter = ++encryptFileCallBackPointerId.counter || 1;
        return encryptFileCallBackPointerId.counter.toString();
    }

    function decryptFileCallBackPointerId() {
        decryptFileCallBackPointerId.counter = ++decryptFileCallBackPointerId.counter || 1;
        return decryptFileCallBackPointerId.counter.toString();
    }

    function encryptFileAtPathCBPointerId() {
        encryptFileAtPathCBPointerId.counter = ++encryptFileAtPathCBPointerId.counter || 1;
        return encryptFileAtPathCBPointerId.counter.toString();
    }

    function decryptFileAtPathCBPointerId() {
        decryptFileAtPathCBPointerId.counter = ++decryptFileAtPathCBPointerId.counter || 1;
        return decryptFileAtPathCBPointerId.counter.toString();
    }

    var sdkPluginIOS = {

        initializeSDK: function(developerKey, licenseKey, delegate) {
            sdkPluginWrapper = delegate;
            var logLevel = 3;
            logLevel = logLevel || 1;
            var configDict = {
                "logLevelKey": logLevel,
                "developerKey": developerKey.developerKey,
                "licenseKey": licenseKey.licenseKey
            };
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "initializeSDK", [configDict]);
            return VALID_API_CALL;
        },

        initializeSDKWithAnalytics: function(developerKey, licenseKey, enableAnalytics, delegate) {
            sdkPluginWrapper = delegate;
            var logLevel = 3;
            logLevel = logLevel || 1;
            var configDict = {
                "logLevelKey": logLevel,
                "developerKey": developerKey.developerKey,
                "licenseKey": licenseKey.licenseKey,
                "enableAnalytics": enableAnalytics.enableAnalytics
            };
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "initializeSDK", [configDict]);
            return VALID_API_CALL;
        },

        getActivationInfo: function() {
            var activationInfo = {
                "billingid": sdkInfo.AccountNumber,
                "csn": sdkInfo.CSN,
                "username": sdkInfo.Username,
                "emailAddress": sdkInfo.EmailAddress,
                "activationState": sdkInfo.ActivationState,
                "deviceOwnership": sdkInfo.DeviceOwnership,
                "domain": sdkInfo.Domain,
                "activationType": sdkInfo.ActivationType
            };
            var stringActivationInfo = JSON.stringify(activationInfo);
            return stringActivationInfo;
        },

        getAppConfig: function() {
            if (!appConfig) {
                exec(this.onEvent, this.onEvent, "MaaS360SDK", "getAppConfiguration", ["appConfig"]);
            }
            return appConfig;
        },

        getContainerLockUpdate: function() {
            return sdkInfo.ContainerLockedStatus;
        },

        getDeviceIdentityAttributeInfo: function() {
            return EMPTY_JSON_STR;
        },

        getPolicyInfo: function() {
            var policyInfo = {
                "policyname": sdkInfo.AppliedPolicyName,
                "policyversion": sdkInfo.AppliedPolicyVersion,
                "shouldRestrictRootedDevice": sdkInfo.JBRestrictionEnforced,
                "saveAsAllowed": !sdkInfo.DataExportRestrictionEnabled,
                "allowedFileTypes": sdkInfo.AllowedDocTypes.split(","),
                "whiteListedApps": sdkInfo.AllowedWhiteListApps.split(","),
                "copyPasteAllowed": !sdkInfo.CopyPasteEnforced,
                "printAllowed": !sdkInfo.DataExportPrintRestrictionEnabled,
                "egEnabled": sdkInfo.EGEnabled
            };
            var stringPolicyInfo = JSON.stringify(policyInfo);
            return stringPolicyInfo;
        },

        getSecurityInfo: function() {
            var complianceStatusLCStr = sdkInfo.ComplianceStatus;
            var isPolicyCompliant = true;
            if (complianceStatusLCStr === 'outofcompliance' || complianceStatusLCStr === 'out of compliance') {
                isPolicyCompliant = false;
            }

            var encryptionState = 'NOT_APPLICABLE';
            if (!sdkInfo.EnforceEncryption) {
                encryptionState = 'DISABLED';
            } else if (sdkInfo.EnforceEncryption) {
                encryptionState = 'ENABLED';
            }

            var passcodeComplianceStatusLCStr = sdkInfo.PasscodeComplianceStatus.toLowerCase();
            var passcodeComplianceStatus = 'NOT_APPLICABLE';
            if (passcodeComplianceStatusLCStr === 'outofcompliance' || passcodeComplianceStatusLCStr === 'out of compliance') {
                passcodeComplianceStatus = 'NOT_COMPLIANT';
            } else if (passcodeComplianceStatusLCStr === 'incompliance' || passcodeComplianceStatusLCStr === 'in compliance') {
                passcodeComplianceStatus = 'COMPLIANT';
            }

            var securityInfo = {
                "policyCompliant": isPolicyCompliant,
                "oocReasons": [sdkInfo.ComplianceReason],
                "rooted": sdkInfo.DeviceRooted,
                "passcodeComplianceStatus": passcodeComplianceStatus,
                "encryptionEnabled": encryptionState
            };
            var stringSecurityInfo = JSON.stringify(securityInfo);
            return stringSecurityInfo;

        },

        getSelectiveWipeStatus: function() {
            var wipeStatus = "NOT_APPLIED";
            var wipeReason = "";

            var wipeStatusLCStr = sdkInfo.RemoteSelectiveWipeStatus.toLowerCase();
            if (wipeStatusLCStr === 'pending') {
                wipeStatus = "PENDING";
            } else if (wipeStatusLCStr === 'revoked') {
                wipeStatus = "REVOKED";
            } else if (wipeStatusLCStr === 'complete') {
                wipeStatus = 'APPLIED';
                wipeReason = sdkInfo.ComplianceReason;
            }

            var wipeInfo = {
                "blockContainer": true,
                "selectiveWipeReason": wipeReason,
                "wipeStatus": wipeStatus
            };

            return JSON.stringify(wipeInfo);
        },

        getUserInfo: function() {
            var userInfo = {
                "username": sdkInfo.Username,
                "userDN": sdkInfo.Domain,
                "groups": sdkInfo.AccessGroup
            };
            var stringUserInfo = JSON.stringify(userInfo);
            return stringUserInfo;
        },

        isGatewayEnabledInPolicy: function() {
            return sdkInfo.EGEnabled;
        },

        shouldHandleRestriction: function(restrictionType) {
            if (sdkInfo !== null) {
                var restrictions = sdkInfo.AppRestricitons;
                var allow = restrictions[restrictionType];
                if (restrictionType === "Gateway") {
                    if (!sdkInfo.EGEnabled) {
                        return false;
                    }
                }
                return (allow === "1");
            }
            return true;
        },

        executeAction: function(actionInfo) {
            var methodName = null;

            if (actionInfo.actionType === "saveDoc") {
                methodName = "saveDocument";
            } else if (actionInfo.actionType === "email") {
                methodName = "composeMail";
            } else if (actionInfo.actionType === "openIn") {
                methodName = "openDocumentIn";
            } else if (actionInfo.actionType === "printIn") {
                methodName = "printDocumentIn";
            } else {
                return UNSUPPORTED_API_CALL;
            }

            if (sdkInfo.ActivatedInNoMaaSMode === 1) {
                return '{"status": "UnsupportedApiCall", "reason": "SDK is in no MaaS App Mode"}';
            }

            exec(this.onEvent, this.onEvent, "MaaS360SDK", methodName, [actionInfo]);

            return VALID_API_CALL;
        },

        startEnterpriseGateway: function(loginInfo) {
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "startEnterpriseGateway", [loginInfo]);
            return VALID_API_CALL;
        },

        disconnectEnterpriseGateway: function() {
            return UNSUPPORTED_API_CALL;
        },

        gatewayConnectionStatus: function(onGatewayStatusResult) {
            gatewayConnectionStatusPointer = onGatewayStatusResult;

            var status = "Not Connected";
            if (this.isEnterpriseGatewayActive()) {
                status = "Connected";
            }

            this.updateGatewayStatus(status);
        },

        getCertPinningInfo: function(onCertPinningInfoAvailable) {},

        // Encryption API
        generateKey: function(resourceInfo, onKeyAvailable) {
            var pointersArray = generateKeyCallBackPointersMap[resourceInfo.resourceKey];
            if (pointersArray) {
                pointersArray.push(onKeyAvailable);
            } else {
                pointersArray = [onKeyAvailable];
            }
            generateKeyCallBackPointersMap[resourceInfo.resourceKey] = pointersArray;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "generateKey", [resourceInfo]);
            return VALID_API_CALL;

        },

        encryptText: function(strToEncrypt, onEncryptionResult) {
            var callbackPointerIdentifier = encryptTextCallBackPointerId();
            encryptTextCallBackPointersMap[callbackPointerIdentifier] = onEncryptionResult;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "encryptText", [{
                'callbackPointerIdentifier': callbackPointerIdentifier,
                'strToEncrypt': strToEncrypt
            }]);
            return VALID_API_CALL;
        },

        decryptText: function(strToDecrypt, onDecryptionResult) {
            var callbackPointerIdentifier = decryptTextCallBackPointerId();
            decryptTextCallBackPointersMap[callbackPointerIdentifier] = onDecryptionResult;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "decryptText", [{
                'callbackPointerIdentifier': callbackPointerIdentifier,
                'strToDecrypt': strToDecrypt
            }]);
            return VALID_API_CALL;
        },

        writeEncryptedFile: function(fileName, textToWrite, onFileWriteComplete) {
            if (onFileWriteComplete) {
                var callbackPointerIdentifier = encryptFileCallBackPointerId();
                encryptFileCallBackPointersMap[callbackPointerIdentifier] = onFileWriteComplete;

                exec(this.onEvent, this.onEvent, "MaaS360SDK", "writeEncryptedFile", [{
                    'callbackPointerIdentifier': callbackPointerIdentifier,
                    'fileName': fileName,
                    'textToWrite': textToWrite
                }]);
            } else {
                exec(this.onEvent, this.onEvent, "MaaS360SDK", "writeEncryptedFile", [{
                    'fileName': fileName,
                    'textToWrite': textToWrite
                }]);
            }
            return VALID_API_CALL;
        },

        readEncryptedFile: function(fileName, onFileReadResult) {
            var callbackPointerIdentifier = decryptFileCallBackPointerId();
            decryptFileCallBackPointersMap[callbackPointerIdentifier] = onFileReadResult;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "readEncryptedFile", [{
                'callbackPointerIdentifier': callbackPointerIdentifier,
                'fileName': fileName
            }]);
            return VALID_API_CALL;
        },

        encryptFileAtPath: function(filePath, onEncryptionComplete) {
            var callbackPointerIdentifier = encryptFileAtPathCBPointerId();
            encryptFileAtPathCBPointersMap[callbackPointerIdentifier] = onEncryptionComplete;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "encryptFileAtPath", [{
                'callbackPointerIdentifier': callbackPointerIdentifier,
                'filePath': filePath
            }]);
            return VALID_API_CALL;
        },

        decryptFileAtPath: function(filePath, onDecryptionComplete) {
            var callbackPointerIdentifier = decryptFileAtPathCBPointerId();
            decryptFileAtPathCBPointersMap[callbackPointerIdentifier] = onDecryptionComplete;
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "decryptFileAtPath", [{
                'callbackPointerIdentifier': callbackPointerIdentifier,
                'filePath': filePath
            }]);
            return VALID_API_CALL;
        },

        // iOS only  functions
        getAllInfo: function() {
            return {
                "info": sdkInfo
            };
        },

        isEnterpriseGatewayActive: function() {
            if (this.isEmptyObj(sdkInfo)) {
                return false;
            }

            return sdkInfo.GatewayActive;
        },

        isBrowserActive: function() {
            if (this.isEmptyObj(sdkInfo)) {
                return false;
            }

            return sdkInfo.BrowserActive;
        },

        openDocument: function(docInfo) {
            return UNSUPPORTED_API_CALL;
        },

        openIn: function(elementId, documentNativeURL, documentName) {
            var rectForButton = document.getElementById(elementId).getBoundingClientRect();
            if (console && console.log) {
                console.log("Co-ordinates of the element for openIn option are", rectForButton.top, rectForButton.right,
                    rectForButton.bottom, rectForButton.left);
            }
            var rectForSending = {
                "XOffset": rectForButton.left,
                "YOffset": rectForButton.top,
                "width": rectForButton.width,
                "height": rectForButton.height
            };
            var eventInfo = {
                "actionType": "openIn",
                "filePath": documentNativeURL,
                "fileName": documentName,
                "buttonRect": rectForSending
            };
            this.executeAction(eventInfo);
        },

        printIn: function(elementId, documentNativeURL, documentName) {
            var rectForButton = document.getElementById(elementId).getBoundingClientRect();
            if (console && console.log) {
                console.log("Co-ordinates of the element for printIn option are", rectForButton.top, rectForButton.right,
                    rectForButton.bottom, rectForButton.left);
            }
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

        // Private functions
        isEmptyObj: function(obj) {
            if (!Object.keys) {
                Object.keys = function(o) {
                    if (o !== Object(o)) {
                        throw new TypeError('Object.keys called on a non-object');
                    }

                    var k = [];
                    var p;
                    for (p in o) {
                        if (Object.prototype.hasOwnProperty.call(o, p)) {
                            k.push(p);
                        }
                    }
                    return k;
                };
            }

            return (0 === Object.keys(obj).length);
        },

        consoleLog: function(message) {
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "consoleLog", [message]);
        },

        refreshSDKInfo: function(context) {
            exec(this.onEvent, this.onEvent, "MaaS360SDK", "getSDKInfo", ["sdkInfo"]);
            return VALID_API_CALL;
        },

        onEvent: function(event) {
            if (!event) {
                return;
            }

            sdkPluginIOS.consoleLog(event);

            var eventId = event.eventId;
            var eventData = event.eventData;

            if (eventId === "ActivationInProgress") {
                sdkPluginWrapper.notifyActivationInProgress();
            } else if (eventId === "SDKInfo") {
                sdkInfo = JSON.parse(eventData);
                sdkPluginIOS.onSDKInfoRefresh(event);
            } else if (eventId === "ConfigurationAvailable") {
                var configInfo = {
                    appConfig: eventData
                };
                appConfig = JSON.stringify(configInfo);
                sdkPluginWrapper.notifyAppConfigUpdate(appConfig);
            } else {
                sdkPluginIOS.refreshSDKInfo(event);
                sdkInfoRefreshPendingEvents.push(event);
            }
        },

        onSDKInfoRefresh: function(event) {
            if (event.eventId === "SDKInfo") {
                sdkInfo = JSON.parse(event.eventData);
            }

            var ev, eventId, eventData;
            var callbackPointerIdentifier, callbackfunction, callbackPointers;
            var invokeGenerateKeyCallback = function(cb, index) {
                cb(eventId, eventData);
            };

            while (sdkInfoRefreshPendingEvents.length) {
                ev = sdkInfoRefreshPendingEvents.pop();

                eventId = ev.eventId;
                eventData = ev.eventData;

                if (eventId === "ActivationStatusChange") {
                    var activationInfo = JSON.parse(sdkPluginIOS.getActivationInfo());
                    if (eventData === "Enrolling") {
                        activationInfo.activationState = eventData;
                    }
                    sdkPluginWrapper.notifyActivationStatusChange(JSON.stringify(activationInfo));
                } else if (eventId === "SelectiveWipeStatusChange") {
                    if (console && console.log) {
                        var wipeInfo = JSON.parse(sdkPluginIOS.getSelectiveWipeStatus());
                        if (wipeInfo.wipeStatus !== eventData.wipeStatus) {
                            console.log("Selective wipe status mismatch [SDK Info: " + wipeInfo.wipeStatus + " Event: " + eventData.wipeStatus + "]");
                        } else if (wipeInfo.selectiveWipeReason !== eventData.selectiveWipeReason) {
                            console.log("Selective wipe reason mismatch [SDK Info: " + wipeInfo.selectiveWipeReason + " Event: " + eventData.selectiveWipeReason + "]");
                        }
                    }
                    sdkPluginWrapper.notifySeleciveWipeStatusChange(JSON.stringify(eventData));
                } else if (eventId === "PolicyInfoChange") {
                    sdkPluginWrapper.notifyPolicyInfoChange(sdkPluginIOS.getPolicyInfo());
                } else if (eventId === "ComplianceInfoChange") {
                    sdkPluginWrapper.notifySecurityInfoChange(sdkPluginIOS.getSecurityInfo());
                } else if (eventId === "UserInfoChange") {
                    sdkPluginWrapper.notifyUserInfoChange(sdkPluginIOS.getUserInfo());
                } else if (eventId === "DeviceIdentityAttributesChange") {
                    sdkPluginWrapper.notifyDeviceIdentityAttributesChange(sdkPluginIOS.getDeviceIdentityAttributeInfo());
                } else if (eventId === "ContainerLockStatusChange") {
                    sdkPluginWrapper.notifyContainerLockUpdate(eventData);
                } else if (eventId === "KeyAvailable" || eventId === "KeyUnAvailable" || eventId === "KeyDestroyed") {
                    callbackPointers = generateKeyCallBackPointersMap[eventData.resourceInfo.resourceKey];
                    callbackPointers.forEach(invokeGenerateKeyCallback);
                } else if (eventId === "EncryptionTextComplete") {
                    callbackPointerIdentifier = eventData.callbackPointerIdentifier;
                    if (callbackPointerIdentifier) {
                        callbackfunction = encryptTextCallBackPointersMap[eventData.callbackPointerIdentifier];
                        if (eventData.result) {
                            callbackfunction({
                                encryptTextResult: eventData.result
                            });
                        } else {
                            callbackfunction({
                                error: eventData.error
                            });
                        }
                        delete encryptTextCallBackPointersMap[eventData.callbackPointerIdentifier];
                    }
                } else if (eventId === "DecryptionTextComplete") {
                    callbackPointerIdentifier = eventData.callbackPointerIdentifier;
                    if (callbackPointerIdentifier) {
                        callbackfunction = decryptTextCallBackPointersMap[eventData.callbackPointerIdentifier];
                        if (eventData.result) {
                            callbackfunction({
                                decryptTextResult: eventData.result
                            });
                        } else {
                            callbackfunction({
                                error: eventData.error
                            });
                        }
                        delete decryptTextCallBackPointersMap[eventData.callbackPointerIdentifier];
                    }
                } else if (eventId === "WriteEncryptedFileComplete") {
                    callbackPointerIdentifier = eventData.callbackPointerIdentifier;
                    if (callbackPointerIdentifier) {
                        callbackfunction = encryptFileCallBackPointersMap[callbackPointerIdentifier];
                        callbackfunction({
                            error: eventData.error
                        });
                        delete encryptFileCallBackPointersMap[callbackPointerIdentifier];
                    }
                } else if (eventId === "ReadEncryptedFileComplete") {
                    callbackPointerIdentifier = eventData.callbackPointerIdentifier;
                    if (callbackPointerIdentifier) {
                        callbackfunction = decryptFileCallBackPointersMap[callbackPointerIdentifier];
                        if (eventData.result) {
                            callbackfunction({
                                textFromFile: eventData.result
                            });
                        } else {
                            callbackfunction({
                                error: eventData.error
                            });
                        }
                        delete decryptFileCallBackPointersMap[callbackPointerIdentifier];
                    }
                } else if (eventId === "EncryptFileAtPathComplete") {
                    callbackPointerIdentifier = eventData.callbackPointerIdentifier;
                    if (callbackPointerIdentifier) {
                        callbackfunction = encryptFileAtPathCBPointersMap[callbackPointerIdentifier];
                        callbackfunction({
                            error: eventData.error
                        });
                        delete encryptFileAtPathCBPointersMap[callbackPointerIdentifier];
                    }
                } else if (eventId === "DecryptFileAtPathComplete") {
                    callbackPointerIdentifier = eventData.callbackPointerIdentifier;
                    if (callbackPointerIdentifier) {
                        callbackfunction = decryptFileAtPathCBPointersMap[callbackPointerIdentifier];
                        callbackfunction({
                            error: eventData.error
                        });
                        delete decryptFileAtPathCBPointersMap[callbackPointerIdentifier];
                    }
                } else if (eventId === "EnterpriseGateway") {
                    if (eventData.status === "GatewayLoginComplete") {
                        this.updateGatewayStatus("Connected");
                        sdkPluginWrapper.notifyGatewayLoginComplete();
                    } else if (eventData.status === "GatewayLogoutComplete") {
                        this.updateGatewayStatus("Not Connected");
                    } else if (eventData.status === "GatewayLoginCredentials") {
                        sdkPluginWrapper.notifyGatewayLoginCredentials();
                    } else if (eventData.status === "GatewayLoginFailed") {
                        sdkPluginWrapper.notifyGatewayLoginFailure(eventData.reason);
                        this.updateGatewayStatus("Not Connected");
                    }
                } else {
                    if (console && console.log) {
                        console.log("Ignored SDK info refresh for event ID", eventId);
                    }
                }
            }
        },

        updateGatewayStatus: function(status) {
            if (null === gatewayConnectionStatusPointer) {
                if (console && console.log) {
                    console.log("Not updating gateway status as pointer is unavailable");
                }
                return;
            }

            gatewayConnectionStatusPointer({
                "gatewayConnectionStatus": status
            });
        }
    };

    module.exports = sdkPluginIOS;
