/* JavaScript content from js/m360sdk.js in folder common */

var maas360sdkEventHandler = {
    // Called when app is activating with MaaS360
    onActivatonInProgress: function() {
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
    },

    /* If passcode is enforced, this is called when the app is locked
     * and unlocked. isLocked is true, when container is locked and
     * false, otherwise
     */
    onContainerLockUpdate: function(isLocked) {
        // application code to handle container lock status goes here
    },

    /* Called when device identity attributes change.
     * Applicable only for android platform.
     */
    onDeviceIdentityAttributesChange: function(deviceAttrInfoStr) {
        // application code to handle device identity change goes here
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
                break;
            case 'Connected':
                // application code when gateway is connected
                break;
            default:
                // application code to handle other scenarios
        }
    }
};

/**
 * function to initialize MaaS360 Workplace SDK.
 * Input Parameters:
 * - developerKey : key provided to developer
 * - licenseKey   : MaaS360 SDK license key
 */
function initM360SDK(developerKey, licenseKey, eventHandler) {
    var sdkHandler = require('./SDKHandler');
    if (!eventHandler) {
        eventHandler = maas360sdkEventHandler;
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
function initM360SDKWithAnalytics(developerKey, licenseKey, enableAnalytics, eventHandler){
    var sdkHandler = require('./SDKHandler');
    if (!eventHandler) {
        eventHandler = maas360sdkEventHandler;
    }
    sdkHandler.registerObserver(eventHandler);
    sdkHandler.initWithAnalytics(developerKey, licenseKey, enableAnalytics);
}
