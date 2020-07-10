//
//  M360SDKConstants.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 08/08/13.
//  Copyright (c) 2013 Fiberlink. All rights reserved.
//

#ifndef MaaS360SDK_M360SDKConstants_h
#define MaaS360SDK_M360SDKConstants_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
//
// SDK state
//
typedef NS_ENUM(NSInteger,MaaS360SDKState) {
    MaaS360SDKStateNull,            // MaaS360 SDK is not configured.
    MaaS360SDKStateNotActivated,    // MaaS360 is not the MDM provider.
    MaaS360SDKStateActivated,      // Device is enrolled and activated, MaaS360 app is also installed.
    MaaS360SDKStateAppNotInstalled, // Device is enrolled and activated, but MaaS360 app is not installed.
    MaaS360SDKStateNotRelevant,     // The SDK integrated application now can consider itself unenroled, it will continue working as a standalone and not MaaS integrated app. Core DB will reset. Reintallation needed for activating SDK again.
    MaaS360SDKStateRecovery,          // Trying to recover vendor id from Maas
    MaaS360SDKUpgarde,                 // Upgrade state.
    MaaS360SDKStandaloneActivated

} ;

//
// Log levels
//
typedef NS_ENUM(NSInteger,MaaS360SDKLogLevel){
    LogLevelError,
    LogLevelInfo,
    LogLevelVerbose,
    LogLevelDetail,
    LogLevelOFF
} ;

//
// App compliance state.
//
typedef NS_ENUM(NSInteger,M360SDKComplianceState){
    M360ComplianceStateInCompliance,        // In compliance.
    M360ComplianceStateOutOfCompliance,     // Out of compliance.
    M360ComplianceStateUnknown              // Compliance state is unknown.
    
} ;

//
// File Action
//
typedef NS_ENUM(NSInteger,FileActionType){
    FileActionTypeSave,
    FileActionTypeEmail
} ;

//
// Automated Restrictions
//
typedef NS_ENUM(NSInteger,M360SDKRestrictionAction){
    M360SDKRestrictionActionAuto,
    M360SDKRestrictionActionEnabled,
    M360SDKRestrictionActionDisabled
} ;

typedef NS_ENUM(NSInteger,M360SDKRestrictionType){
    M360SDKRestrictionTypeEnrolment,
    M360SDKRestrictionTypeWipe,
    M360SDKRestrictionTypeFileExport,
    M360SDKRestrictionTypeJailbreak
} ;

//SDK Profile Keys

extern NSString *const kM360MaaSRootId;
extern NSString *const kM360AccountNumber;
extern NSString *const kM360CSN;
extern NSString *const kM360DeviceUDID;
extern NSString *const kM360CopyPasteRestrictionEnforcementStatus;
extern NSString *const kM360JBRestrictionEnforcementStatus;
extern NSString *const kM360WipeEnforcementStatus;
extern NSString *const kM360AuthEnforcementStatus;
extern NSString *const kM360AuthEnforcementTimeout;
extern NSString *const kM360AppliedPolicyName;
extern NSString *const kM360AppliedPolicyVersion;

extern NSString *const kM360WhiteListedAppsKey;
extern NSString *const kM360DataExportRestrictionEnforcementNeededKey;
extern NSString *const kM360DataExportRestrictionPrintKey;
extern NSString *const kM360ComplianceStatus;
extern NSString *const kM360OOCComplianceReason;

extern NSString *const kM360InCompliance;
extern NSString *const kM360InComplianceV2;
extern NSString *const kM360OutOfCompliance;
extern NSString *const kM360OutOfComplianceV2;

//Wipe Keys
extern NSString *const kM360SelectiveWipeStatus;
extern NSString *const kM360SelectiveWipeKey;
extern NSString *const kM360SelectiveWipeNotAppliedKey;
extern NSString *const kM360SelectiveWipeRevokedKey;
extern NSString *const kM360SelectiveWipeRevertedKey;
extern NSString *const kM360SelectiveWipeCompleteKey;
extern NSString *const kM360SelectiveWipePendingKey;
extern NSString *const kM360SelectiveWipeNotified;
extern NSString *const kM360SecurityComplianceReasons;

extern NSString *const kActionTypeKey;
extern NSString *const kActionTypeEmail;
extern NSString *const kActionTypeSaveFile;
extern NSString *const kFileNameKey;
extern NSString *const kFileDataKey;
extern NSString *const kConfigurationKey;

extern NSString *const kMIMETypeKey;
extern NSString *const kEmailToKey;
extern NSString *const kCCKey;
extern NSString *const kBCCKey;
extern NSString *const kSubjectKey;
extern NSString *const kBodyKey;

//Enterprise Gateway Keys
extern NSString *const kEnterpriseUserName;
extern NSString *const kEnterprisePassword;
extern NSString *const kEnterpriseDomain;

extern NSString *const kM360UserName;
extern NSString *const kM360EmailAddress;
extern NSString *const kM360AccessGroup;

extern NSString *const kM360SDKVersion;

extern NSString *const kM360AllowedDocTypesKey;
extern NSString *const kM360AllowedLogsCollection;
extern NSString *const kEnforceEncryption;


extern NSString *const kM360ContainerLockedStatus;

//SDK Info Plist keys
extern NSString *const infoSDKBuild;
extern NSString *const infoSDKRevision;
extern NSString *const infoSDKAppRestrictions;
extern NSString *const infoSDKAppRestrictionsType;
extern NSString *const infoSDKAppRestrictionsAction;

extern NSString *const kNotEnrolled;
extern NSString *const kNotInstalled;
extern NSString *const kDeviceInWipeState;
extern NSString *const kLoginTitle;
extern NSString *const kComplianceAlertTitle;
extern NSString *const kDeviceInWipeStateDetails;
extern NSString *const kLoginUIHeader;
extern NSString *const kComplianceHeader;
extern NSString *const kUnautorizedApp;

extern NSString *const kSDKAppRestrictionTypeEnrolment;
extern NSString *const kSDKAppRestrictionTypeWipe;
extern NSString *const kSDKAppRestrictionTypeFileExport;
extern NSString *const kSDKAppRestrictionTypeJailbreak;
extern NSString *const kSDKAppRestrictionTypeGateway;
extern NSString *const kSDKAppRestrictionTypeSSO;
extern NSString *const kSDKAppRestrictionTypeCopyPaste;
extern NSString *const kSDKAppRestrictionTypeTimeBomb;
extern NSString *const kSDKAppRestrictionTypePrint;
extern NSString *const kSDKAppRestrictionTypeTimeBasedPolicyOutOfcompliance;

extern NSString *const kSDKAppRestrictionActionAuto;
extern NSString *const kSDKAppRestrictionActionManual;
extern NSString *const kSDKAppRestrictionActionDisabled;

extern NSString *const kM360SDKDomain;

extern NSString *const kM360SDKAppRestrictions;

extern NSString *const ksdkAppTypeKey;
extern NSString *const ksdkAppTypeHybrid;
extern NSString *const ksdkAppTypeNative;

extern NSString *const kEGDisabled;
extern NSString *const kM360ContainerError;

///<-- StandaAloneActivation, MaaSBasedActivation, OptionalMaaSBasedActivation -->



extern NSString *const kM360SDKActivationType;

extern NSString *const kM360SDKEGEnabledKey;

extern NSString *const kM360SDKPasscodeCompliance;
extern NSString *const kM360SDKDeviceRooted;
extern NSString *const kM360SDKDeviceOwnership;

extern NSString *const kM360SDKGatewayActive;
extern NSString *const kM360SDKBrowserActive;

extern NSString *const ksdkActivationMode;
extern NSString *const ksdkStandAloneActivation;
extern NSString *const ksdkMaaSBasedActivation;
extern NSString *const ksdkOptionalMaaSBasedActivation;
extern NSString *const ksdkActivatedInNoMaaSMode;
extern NSString *const ksdkDisableCopyPaste;
extern NSString *const ksdkRestrictFileExport;
extern NSString *const ksdkOpenWithApps;
extern NSString *const ksdkAllowDocTypes;
extern NSString *const ksdkGatewayId;
extern NSString *const ksdkEnableTimebomb;
extern NSString *const ksdkRestrictJailbRokenDevice;
extern NSString *const ksdkDataProtectionPolicy;
extern NSString *const ksdkSecurityPolicy;
extern NSString *const ksdkPolicyVersion;
extern NSString *const ksdkPolicyName;
extern NSString *const ksdkPayload;
extern NSString *const ksdkPayloadName;
extern NSString *const ksdkPayloadType;

extern NSString *const kM360SDKErrorDomain;
extern NSInteger const kM360SDKGatewayError;

extern NSString *const kSDKUpgradeCompleted;
extern NSString *const kSDKUpgradeStarted;
extern NSString *const kApplyWorkplaceSecuritySettings;
extern NSString *const ksdkDeviceInSignoutState;
extern NSString *const ksdkDeviceInSignoutStateDetails;

extern NSString *const kLicenseKey;
extern NSString *const kDeveloperID;

extern NSString *const kcanAccessderivedCredentials;
extern NSString *const kMaaSSDKDerivedCredentialsUsageDescription;
extern NSString *const kSDKCertErrorDomian;

//VPN Connection status.
typedef NS_ENUM(NSInteger, MAAS_VPN_CONNECTION_STATUS ) {
    VPN_SUCESS,
    VPN_FAIL,
    VPN_CANCEL
};

extern NSString *const kHost;
extern NSString *const kSuggestedTitle;
extern NSString *const kSuggestedMessage;
extern NSString *const kSuggestedDismiss;


typedef NS_ENUM(NSInteger, M360SDKResourceType) {
    M360SDKdb = 0,
    M360SDKfile = 1,
    M360SDKdata = 2
};

typedef NS_ENUM(NSInteger, M360SDKDataClassType){
    M360SDKAppData = 0,
    M360SDKUserData = 1,
    M360SDKIPCData __deprecated_enum_msg("Data type should not be used along with 2.98 sdk.") = 2,
    M360SDKSharedDeviceData __deprecated_enum_msg("Data type should not be used along with 2.98 sdk") = 3,
    M360SDKSharedUserData __deprecated_enum_msg("Data type should not be used along with 2.98 sdk") = 4
};

typedef NS_ENUM(NSInteger, M360SDKKeyType) {
    M360SDKSymmetric = 0,
    M360SDKAsymmetric = 1
} ;

typedef NS_ENUM(NSInteger, M360SDKKeyEventType){
    M360SDKKeyAvailable = 0,
    M360SDKKeyUnvailable = 1,
    M360SDKKeyDestroyed = 2,
    M360SDKKeyError = 3
};


typedef NS_ENUM(NSInteger, M360SDKERRORCODE){
    M360SDKLicenseOrDeveloperKeyNotAvialiable = -50,
    M360SDKSdkRecoveryMode = -100,
    M360SDKSdkUpgradeFailed = -200,
    M360SDKFilesAreDataProtected = -300
};


typedef NS_ENUM(NSInteger, M360SDKCertERRORCODE){
    M360SDKCertNotDefinedInPolicy = 0,
    M360SDKCertSDKInIrrelevantState = 1,
    M360SDKCertNotFound  =  2,
    M360SDKCertUsageDescriptionNotDefined = 3,
    M360SDKCertUserDeclinedAccessToDerivedCredentials = 4,
    M360SDKCertSDKIsinOutOfCompliance = 5,
    M360SDKCertPivDNotInstalled = 1001
    
    
};

extern NSString *const M360SDKInvalidSetupException;

#endif
