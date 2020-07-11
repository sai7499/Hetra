//
//  MaaS360SDK.h
//  MaaS360SDK
//
//  Created by Karthik Ramgopal on 06/04/13.
//  Copyright (c) 2013 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "M360SDKConstants.h"
#import "M360SDKEditorDocContext.h"
#import "M360SDKComplianceInfo.h"
#import "M360SDKDocExportSetting.h"
#import "MaaS360SDKDelegate.h"
#import "M360SDKConfig.h"
#import "M360SDKBaseClass.h"
#import "M360SDKCert.h"

NS_ASSUME_NONNULL_BEGIN

// The MaaS360SDK interface.
@interface MaaS360SDK : NSObject<M360SDKBaseClass>

// The delegate.
@property (nullable, nonatomic, assign) id<MaaS360SDKDelegate> delegate;

+ (void)setInitConfig:(nullable NSMutableDictionary *)initConfig;

+ (nullable NSMutableDictionary *)getInitConfig;

+ (BOOL)getAnalyticsEnabledFlag;

+ (BOOL)canInitWithSDKConfig:(M360SDKConfig *)sdkConfig error:(NSError **)error;

// Get the shared singleton instance if the setAndValidateSDKConfiguration:withCompletionBlock was successful
+ (nullable MaaS360SDK *)shared;

// Variable to check if application is wrapped
+ (BOOL)isWrappedApp;

// Return the SDK version.
- (NSString *)sdkVersion;

// Get the SDK state.
- (MaaS360SDKState)sdkState;

- (BOOL)setAndValidateSDKConfiguration:(M360SDKConfig *)sdkConfig  withCompletionBlock:(void (^)(NSError *_Nullable))completion;

// Bootstrap the SDK.
- (void)bootstrapSDKWithCompletionHandler:(void (^)(MaaS360SDKState state))handler;

// Start SDK operations.
- (void)startSDKOperations;

// to check if sdk operations are already started
- (BOOL)haveSDKOperationsAlreadyStarted;

// Stop SDK operations.
- (void)stopSDKOperations;

// Handle a URL response. If the return value is YES, then the SDK will handle the given response; if NO
// the application should handle it appropriately.
- (BOOL)handleURLResponse:(NSURL *)url sourceApplication:(nullable NSString *)sourceApp annotations:(nullable id)annotation;

// Set log level.
- (void)setLogLevel:(MaaS360SDKLogLevel) level;

// Returns nil if there is no error, For future use
- (nullable NSError *)getLastError;

// Returns SDK info
- (NSDictionary *)getSDKInfo;

- (BOOL)canPresentUI;

- (void)setCanPresentUI:(BOOL)presentUI;

// handle applicaiton become active state
- (void)handleAppDidBecomeActive;

// handle applicaiton did enter background
- (void)handleDidEnterBackground;

#ifndef STANDALONE_SDK

// Send ot Email Doc At Path
- (void)saveFileAtFilePath:(nullable NSString *)path withAction:(FileActionType)action andInfo:(NSDictionary *)info;

// Start Enterprise Gateway Method
- (void)startEnterpriseGatewayWithLoginInfo:(nullable NSDictionary *)info;

// Enterprise Gateway Policy update method. returns YES if gateway is loggedIn. Else returns No.
- (BOOL)isEnterpriseGatewayActive;

// Stop Enterprise Gateway Logout
- (void)stopEnterpriseGateway;

// Enterprise Gateway enabled check
- (BOOL)isEnterpriseGatewayEnabled;

// Check if Doc editing is possible (allowed via policy, secure editor is present)
- (BOOL)canEditDoc;

// Edit doc
- (void)editDoc:(M360SDKEditorDocContext *)docContext;

// App Info
- (void)setAppInfo:(nullable NSDictionary *)appInfo;

// SDK App Configuration
- (nullable NSData *)getAppConfiguration;

// Get SDK current log level.
- (MaaS360SDKLogLevel)getSdkLogLevel;

// Get UserID Cert
-(void) getUserIdCertWithCompletionHandler:(void (^)(M360SDKCert *cert, NSError *error))completion;

#endif

/* To capture crash incase of third party apps having already registered as exception handler before AnalyticsCrash service did */
#define SEND_CRASH_REPORTED_NOTIFICATION [[FLCODefaultsWrapper shared] setValue:@"YES" forKey:@"FLCRAnalyticsCrashMsg"]; \
                                         [[NSNotificationCenter defaultCenter] postNotificationName:@"crashReportCapturedFromPrevLaunch" object:nil];
@end

NS_ASSUME_NONNULL_END
