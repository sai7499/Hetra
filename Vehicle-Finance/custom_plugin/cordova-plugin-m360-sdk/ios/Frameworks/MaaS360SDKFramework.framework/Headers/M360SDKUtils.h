//
//  M360SDKUtils.h
//  MaaS360SDK
//
//  Created by Chandan singh on 9/20/13.
//  Copyright (c) 2013 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "MaaS360SDK.h"
#import "M360SDKBaseClass.h"
#import <MessageUI/MFMailComposeViewController.h>


typedef enum : NSUInteger {
    
    AppActivationStateNone = 0,
    AppActivationStateIniContext,
    AppActivationStateAuthenticate,
    AppActivationStateVerify,
    AppActivationStateSwitch
    
} M360SKDActivationState;

#define flIsSDKNotInitialized (nil == [MaaS360SDK shared])
#define GetM360LocalizedString(key, comment) [M360SDKUtils getLocalizedStringforM360SDK:key]
#define M360_CORE_IMAGE_WITH_NAME(name) [M360SDKUtils getResourceFromCoreWithName:name]

@class M360AlertViewContext;

@interface M360SDKUtils : NSObject<M360SDKBaseClass>

+ (NSString*)mimeTypeForFileAtPath:(NSString *)path;

+ (NSString*)getMaaSRootId;
+ (NSString*)getMaaSInstanceId;

+ (NSString*)getBillingId;

+ (NSString*)getDeviceId;

+ (NSString*)getPolicyName;

+ (NSString*)getPolicyVersion;

+ (BOOL)isCopyPasteRestricted;

+ (BOOL)isJBRestrictionEnforced;

+ (BOOL)isAuthEnforced;

+ (NSUInteger)getAuthEnforcementTimeout;

+ (NSString*)getWhiteListedApps;

+ (BOOL)isExportRestricted;

+ (M360SDKComplianceState)getComplianceStatus;

+ (NSString*)getComplianceReason;

+ (BOOL) isDeviceInWipeState;

+ (NSString*)getDeviceUDID;

+ (NSString*)getUsername;

+ (NSString*)getEmailAddress;

+ (NSString*)getAccessGroup;

+ (NSDictionary*)getDeviceInfo;

+ (NSString*)getAllowedDocTypes;

+(BOOL)isFileExtensionAllowedToExport:(NSString *)extension;

+(BOOL) isEncryptionEnforced;

+(NSString *) getDomain;

+(NSString *) getPreferredSDKActivationMode;

+(NSString *)getSDKVersion;

+(BOOL) isBrowserAppAvailable;

+(BOOL) isBrowserAppIntranetAccessAvailable;

+(BOOL) isFileImportRestrictionEnabled;

+(BOOL) openURLInBrowserApp:(NSURL *) urlP;

+ (NSURL *)browserSchemedUrlForURL:(NSURL*)webUrl;

+(NSString *) getLocalizedStringforM360SDK:(NSString *) str;

+(BOOL) isDeviceInPoolState;

+ (UIImage *) getResourceFromCoreWithName:(const NSString*)imageName;

+ (NSString *) appBundleName;

+ (NSString *) appBundleVersion;

+(void) sendLogsThroughEmail:(id)sender;

+(void) sendLogsWithDescription:(NSString *)description viaNativeMail:(BOOL)sendViaNative andMailComposeDelegate:(id<MFMailComposeViewControllerDelegate>) delegate;

+(BOOL) encryptFileAtPath:(NSString *)sourcefilePath copyTo:(NSString *)destFilePath withKeyInfo: (NSData *) key;

+(BOOL) decryptFileAtPath:(NSString *)sourcefilePath copyTo:(NSString *)destFilePath withKeyInfo: (NSData *) key;

+ (BOOL) isDeviceInSignOutState;

+(BOOL) isIntranetSite:(NSString *)url;

#if ENABLE_VIEWKEYS
+(void)testKeys;
+(void)deleteKeyswithCompletionHandler:(void (^)(BOOL, NSError*))handler;
#endif
+ (BOOL)shouldShowBlockingScreenOnOOC;

+(void)enqueueAlertWithContext:(M360AlertViewContext *)context;
@end
