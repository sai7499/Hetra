//
//  M360SDKPlugin.m
//
//  Created by Vinay Raja on 03/02/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <CommonCrypto/CommonCryptor.h>
#import <MaaS360SDKFramework/MaaS360SDKFramework.h>
#import "M360SDKPlugin.h"

@interface M360SDKPlugin () <MaaS360SDKDelegate>
{
    NSString *_callBackID;
    NSString *_lastReportedAppConfig;
}

@property (nonatomic, strong) MaaS360SDK *m360SDK;
@property (nonatomic, strong) UIDocumentInteractionController *documentInteractionViewController;
@property (nonatomic, strong) M360SDKPrintInteractionController *printInteractionController;
@end

#define FileAESDefaultChunkSize 64 * 1024

static NSString *kNotifyConfigAvailable = @"ConfigurationAvailable";
static NSString *kConfigData = @"ConfigData";

static NSString *kNotifyCallbackId = @"eventId";
static NSString *kNotifyCallbackValue = @"eventData";
static NSString *kNotifyCallbackValueResult = @"result";
static NSString *kNotifyCallbackValueError = @"error";
static NSString *kNotifyCallbackPointerId = @"callbackPointerIdentifier";

static NSString *kNotifyActivationStateChange = @"ActivationStatusChange";
static NSString *kNotifyComplianceChange = @"ComplianceInfoChange";
static NSString *kNotifyPolicyAvailable = @"PolicyInfoChange";
static NSString *kNotifySelectiveWipeChange = @"SelectiveWipeStatusChange";
static NSString *kNotifyContainerLockStatusChange = @"ContainerLockStatusChange";
static NSString *kNotifyKeyAvailable = @"KeyAvailable";
static NSString *kNotifyKeyUnAvailable = @"KeyUnAvailable";
static NSString *kNotifyKeyDestroyed = @"KeyDestroyed";
static NSString *kUnsupportedApiCall = @"UnsupportedApiCall";
static NSString *kEncryptionTextComplete = @"EncryptionTextComplete";
static NSString *kDecryptionTextComplete = @"DecryptionTextComplete";
static NSString *kWriteEncryptedFileComplete = @"WriteEncryptedFileComplete";
static NSString *kReadEncryptedFileComplete = @"ReadEncryptedFileComplete";
static NSString *kEncryptFileAtPathComplete = @"EncryptFileAtPathComplete";
static NSString *kDecryptFileAtPathComplete = @"DecryptFileAtPathComplete";

static NSString *kSelectiveWipeStatusKey = @"wipeStatus";
static NSString *kBlockContainer = @"blockContainer";
static NSString *kSelectiveWipeReasonKey = @"selectiveWipeReason";
static NSString *kNotifySWApplied = @"APPLIED";
static NSString *kNotifySWRevoked = @"REVOKED";
static NSString *kNotifySDKInfo = @"SDKInfo";

static NSString *kNotifyEnterpriseGateway = @"EnterpriseGateway";
static NSString *kNotifyEGLoginCredentials = @"GatewayLoginCredentials";
static NSString *kNotifyEGLogin = @"GatewayLoginComplete";
static NSString *kNotifyEGLoginError = @"GatewayLoginFailed";
static NSString *kNotifyEGLogout = @"GatewayLogoutComplete";
static NSString *kEGLoginUserName = @"USER";
static NSString *kEGLoginDomainName = @"DOMAIN";
static NSString *kEGLoginPassword = @"PASSWORD";

static NSString *kEGJSLoginUserName = @"username";
static NSString *kEGJSLoginDomainName = @"domain";
static NSString *kEGJSLoginPassword = @"password";


static NSString *kEGStatus = @"status";
static NSString *kEGErrorReason = @"reason";

static NSString *kNotifyInfoKey = @"Info";
static NSString *kNotifyContextKey = @"Context";

static NSString *kDocFilePath = @"filePath";
static NSString *kDocFileName = @"fileName";
static NSString *kEmailAttachmentPaths = @"attachmentPaths";
static NSString *kButtonRect = @"buttonRect";
static NSString *kXOffset = @"XOffset";
static NSString *kYOffset = @"YOffset";
static NSString *kHeight = @"height";
static NSString *kWidth = @"width";


static NSString *kEmailKeyTo = @"to";
static NSString *kEmailKeyCC = @"cc";
static NSString *kEmailKeyBCC = @"bcc";
static NSString *kEmailKeySubject = @"subject";
static NSString *kEmailKeyBody = @"body";

static NSString *kNotifyActivationInProgress = @"ActivationInProgress";

static NSString *ksdkStateNotConfigured = @"NotConfigured";
static NSString *ksdkStateActivated = @"Activated";
static NSString *ksdkStateMaaSAppNotInstalled = @"NotInstalled";
static NSString *ksdkStateNotActivated = @"NotActivated";
static NSString *ksdkStateConfiguring = @"Enrolling";
static NSString *ksdkStateNotEnrolled = @"NotEnrolled";
static NSString *ksdkStateNotRelevant = @"NotRelevant";
static NSString *ksdkStateRecovery = @"Recovery";


static NSString *kActivationStateKey = @"ActivationState";

static NSString *kDeveloperKey = @"developerKey";
static NSString *klicenseKey = @"licenseKey";
static NSString *kConfig = @"config";
static NSString *kEnableAnalytics = @"enableAnalytics";

static NSString *kResourceKey = @"resourceKey";
static NSString *kResourceType = @"resourceType";
static NSString *kDataClassType = @"dataClassType";
static NSString *kResourceInfo = @"resourceInfo";
static NSString *kEncryptionKey = @"encryptionKey";

static NSString *kStrToEncrypt = @"strToEncrypt";
static NSString *kStrToDecrypt = @"strToDecrypt";
static NSString *kFileName = @"fileName";
static NSString *kTextToWrite = @"textToWrite";
static NSString *kFilePath = @"filePath";

static inline M360SDKResourceInfo* getSDKUserProtectionResource()
{
    M360SDKResourceInfo *resourceInfo = [[M360SDKResourceInfo alloc] init];
    resourceInfo.resourceKey = @"SDKResourceMgmtProtectionKey";
    resourceInfo.resourceType = M360SDKdata;
    resourceInfo.dataClassType = M360SDKUserData;
    return resourceInfo;
}

static inline NSString *getUniqueTempFilePath()
{
    NSString *  result;
    CFUUIDRef   uuid;
    CFStringRef uuidStr;
    
    uuid = CFUUIDCreate(NULL);
    assert(uuid != NULL);
    
    uuidStr = CFUUIDCreateString(NULL, uuid);
    assert(uuidStr != NULL);
    
    result = [NSTemporaryDirectory() stringByAppendingPathComponent:[NSString stringWithFormat:@"M360-%@", uuidStr]];
    assert(result != nil);
    
    CFRelease(uuidStr);
    CFRelease(uuid);
    
    return result;
}

static inline NSString *getSystemFilePath(NSString *filePath)
{
    if ([[NSFileManager defaultManager] fileExistsAtPath:filePath])
    {
        return filePath;
    }
    
    // Check if the filePath is localUri
    NSURL *url = [NSURL URLWithString:filePath];
    if ([[NSFileManager defaultManager] fileExistsAtPath:url.path])
    {
        return url.path;
    }
    
    M360SDKLogCError(@"Attachment does not exists [Path: %@]", filePath);
    return nil;
}

static inline NSString *getTrimmedString(NSString *str)
{
    return [str stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
}

static inline BOOL isEmptyString(id str)
{
    return (str == nil || [str isKindOfClass:[NSNull class]] ||
            0 == [getTrimmedString(str) length]);
}

static inline NSArray *getArrayFromString(NSString *str, NSString *delimiter)
{
    if (isEmptyString(str))
    {
        return @[];
    }

    NSArray *strings = [str componentsSeparatedByString:delimiter];
    NSMutableArray *trimmedStrings = [NSMutableArray array];
    for (NSString *string in strings)
    {
        NSString *trimmedString = getTrimmedString(string);
        if (!isEmptyString(trimmedString))
        {
            [trimmedStrings addObject:trimmedString];
        }
    }

    return [trimmedStrings copy];
}

static inline BOOL removeFile(NSString *filePath)
{
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSError* __autoreleasing error = nil;
    if ([fileManager removeItemAtPath:filePath error:&error])
    {
        M360SDKLogCDetail(@"Removed file at path %@", filePath);
        return YES;
    }
    
    M360SDKLogCError(@"Failed to remove file at %@ [Error: %@]", filePath, error);
    return NO;
}

static inline BOOL moveFile(NSString *src, NSString *dest)
{
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSError* __autoreleasing error = nil;
    
    if ([fileManager fileExistsAtPath:dest] && !removeFile(dest))
    {
        return NO;
    }
    
    if (![fileManager moveItemAtPath:src toPath:dest error:&error])
    {
        M360SDKLogCError(@"Failed to move file from %@ to %@ [Error: %@]", src, dest, error);
        return NO;
    }
    
    M360SDKLogCDetail(@"Moved file from %@ to %@", src, dest);
    return YES;
}

static inline NSString *toJSONString(NSDictionary *dict)
{
    NSMutableDictionary *jsonDict = [NSMutableDictionary new];
    for (NSString *key in dict)
    {
        id value = dict[key];
        if ([value isKindOfClass:[NSString class]])
        {
            NSString *lcStr = [value lowercaseString];
            if ([lcStr isEqualToString:@"yes"] || [lcStr isEqualToString:@"true"])
            {
                value = @YES;
            }
            else if ([lcStr isEqualToString:@"no"] || [lcStr isEqualToString:@"false"])
            {
                value = @NO;
            }
        }
        
        [jsonDict setObject:value forKey:key];
    }
    
    NSError *serializationError;
    NSData *jsonData = [NSJSONSerialization
                        dataWithJSONObject:jsonDict
                        options:0 error:&serializationError];
    if (!jsonData)
    {
        M360SDKLogCError(@"Error serializing to JSON [Object: %@ Error: %@]", jsonDict, serializationError);
    }
    
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

@implementation M360SDKPlugin

#pragma mark -  JS Interface Calls

-(void) initializeSDK:(CDVInvokedUrlCommand *)command
{
    _callBackID = [command.callbackId copy];
    NSArray *args = [command arguments];
    NSDictionary *config = nil;
    if ([args count] > 0) {
        config = [args firstObject];
    }
    [self initMaaS360SDKWithConfig:config];
}

-(void) getSDKInfo:(CDVInvokedUrlCommand *) command
{
    NSMutableDictionary *sdkInfo = [[_m360SDK getSDKInfo] mutableCopy];
    
    [sdkInfo setObject:[[self class] sdkStateToString:[_m360SDK sdkState]] forKey:kActivationStateKey];
    
    NSDictionary *returnDict = @{kNotifyCallbackId:kNotifySDKInfo,
                                 kNotifyCallbackValue: toJSONString(sdkInfo)};
    
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:returnDict];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)getAppConfiguration:(CDVInvokedUrlCommand *)command
{
    M360SDKLogInfo(@"Get app configuration called");
    NSData *configData = [[MaaS360SDK shared] getAppConfiguration];
    [self newConfigurationAvailable:configData];
}

-(void) startEnterpriseGateway:(CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params = nil;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    NSDictionary *details = nil;
    if (params && ![params isEqual:[NSNull null]]) {
        NSString *userName = [self getNonNulledString:params[kEGJSLoginUserName]];
        NSString *password = [self getNonNulledString:params[kEGJSLoginPassword]];
        NSString *domain = [self getNonNulledString:params[kEGJSLoginDomainName]];
        
        
        details = @{kEGLoginDomainName: domain,
                    kEGLoginUserName: userName,
                    kEGLoginPassword: password};
    }
    [self sendAuthRequest:details];
}

-(void) saveDocument:(CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    if ([args count] == 0)
    {
        M360SDKLogError(@"Failed to save document [Reason: No arguments]");
        return;
    }
    
    NSDictionary *params = [args firstObject];
    
    NSString *filePath = params[kDocFilePath];
    NSString *systemFilePath = getSystemFilePath(filePath);
    if (nil == systemFilePath)
    {
        M360SDKLogError(@"Failed to save document at path '%@' [Reason: File not found]", filePath);
        return;
    }
    
    NSDictionary *info = nil;
    
    NSString *fileName = params[kDocFileName];
    if (!isEmptyString(fileName)) {
        info = @{kFileNameKey: fileName};
    }
    
    [[MaaS360SDK shared] saveFileAtFilePath:systemFilePath withAction:FileActionTypeSave andInfo:info];
}

- (void)openDocumentIn:(CDVInvokedUrlCommand *)command {
    NSArray *args = [command arguments];
    if([args count] == 0) {
        M360SDKLogError(@"Failed to open document in other apps [Reason: No arguments]");
        return;
    }
    
    NSDictionary *params = [args firstObject];
    
    NSString *filePath = params[kDocFilePath];
    NSString *systemFilePath = getSystemFilePath(filePath);
    if(nil == systemFilePath) {
        M360SDKLogError(@"Failed to open document at path '%@' in other apps [Reason: File not found]", filePath);
        return;
    }
    
    NSURL *documentURL = [NSURL fileURLWithPath:systemFilePath];
    
    NSDictionary *coordinates = params[kButtonRect];
    CGFloat x = [coordinates[kXOffset] floatValue];
    CGFloat y = [coordinates[kYOffset] floatValue];
    CGFloat w = [coordinates[kWidth] floatValue];
    CGFloat h = [coordinates[kHeight] floatValue];
    
    self.documentInteractionViewController = [M360SDKDocumentInteractionController interactionControllerWithURL:documentURL];
    UIView *currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject];
    CGRect rect = CGRectMake(x,y,w,h);
    [_documentInteractionViewController presentOpenInMenuFromRect:rect inView:currentView animated:YES];
}

- (void)printDocumentIn:(CDVInvokedUrlCommand *)command {
    NSArray *args = [command arguments];
    if([args count] == 0) {
        M360SDKLogError(@"Failed to print document, [Reason: No arguments]");
        return;
    }
    
    NSDictionary *params = [args firstObject];
    
    NSString *filePath = params[kDocFilePath];
    NSString *systemFilePath = getSystemFilePath(filePath);
    if(nil == systemFilePath) {
        M360SDKLogError(@"Failed to print document at path '%@' [Reason: File not found]", filePath);
        return;
    }
    
    NSURL *documentURL = [NSURL fileURLWithPath:systemFilePath];
    
    NSDictionary *coordinates = params[kButtonRect];
    CGFloat x = [coordinates[kXOffset] floatValue];
    CGFloat y = [coordinates[kYOffset] floatValue];
    CGFloat w = [coordinates[kWidth] floatValue];
    CGFloat h = [coordinates[kHeight] floatValue];
    
    if([M360SDKPrintInteractionController isPrintingAvailable] == NO) {
        M360SDKLogError(@"Can't print, as printing service is busy or not supported/configured on the device");
        return;
    }
    if([M360SDKPrintInteractionController canPrintURL:documentURL] == NO) {
        M360SDKLogError(@"Can't print document of this type");
        return;
    }
    
    UIPrintInfo *printJob = [UIPrintInfo printInfo];
    printJob.jobName = @"Printing document from iOS SDK app";
    printJob.orientation = UIPrintInfoOrientationPortrait;
    printJob.outputType = UIPrintInfoOutputGeneral;
    printJob.duplex = UIPrintInfoDuplexLongEdge;
    
    M360SDKPrintInteractionController *printInteractionController = [M360SDKPrintInteractionController sharedPrintController];
    
    printInteractionController.printingItem = documentURL;
    printInteractionController.printInfo = printJob;
    
    UIView *currentView = [[[[UIApplication sharedApplication] keyWindow] subviews] lastObject];
    CGRect rect = CGRectMake(x,y,w,h);
    
    [printInteractionController presentFromRect:rect inView:currentView animated:YES completionHandler:^(UIPrintInteractionController * printInteractionController, BOOL completed, NSError * error) {
        if(completed) {
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Document Printed" message:@"Printing successful" delegate:nil cancelButtonTitle:@"Ok" otherButtonTitles:nil, nil];
            [alert show];
        }
        else if (error) {
            NSString *errorMessage = [[NSString alloc] initWithFormat:@"Printing failed with error %@", [error  localizedDescription]];
            M360SDKLogError(@"Error in printing %@", errorMessage);
        }
    }];
}

-(void) composeMail:(CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    if ([args count] == 0)
    {
        M360SDKLogError(@"Failed to save document [Reason: No arguments]");
        return;
    }
    
    NSDictionary *params = [args firstObject];
    
    NSMutableDictionary *info = [[NSMutableDictionary alloc] init];
    
    NSString *filePath = params[kEmailAttachmentPaths];
    NSString *systemFilePath = getSystemFilePath(filePath);
    if (nil == systemFilePath && !isEmptyString(filePath))
    {
        M360SDKLogError(@"Failed to add attachment at path '%@' [Reason: File not found]", filePath);
    }
    
    NSString *fileName = params[kDocFileName];
    
    if ([fileName length] > 0)
    {
        [info setObject:fileName forKey:kFileNameKey];
    }

    NSArray *toArray = getArrayFromString([params objectForKey:kEmailKeyTo], @",");
    if ([toArray count] > 0)
    {
        [info setObject:toArray forKey:kEmailToKey];
    }

    NSArray *bccArray = getArrayFromString([params objectForKey:kEmailKeyBCC], @",");
    if ([bccArray count] > 0)
    {
        [info setObject:bccArray forKey:kBCCKey];
    }

    NSArray *ccArray = getArrayFromString([params objectForKey:kEmailKeyCC], @",");
    if ([ccArray count] > 0)
    {
        [info setObject:ccArray forKey:kCCKey];
    }

    if ([params objectForKey:kEmailKeySubject])
    {
        [info setObject:[params objectForKey:kEmailKeySubject] forKey:kSubjectKey];
    }

    if ([params objectForKey:kEmailKeyBody])
    {
        [info setObject:[params objectForKey:kEmailKeyBody] forKey:kBodyKey];
    }
    
    [[MaaS360SDK shared] saveFileAtFilePath:systemFilePath withAction:FileActionTypeEmail andInfo:info];
}

-(void) openURL:(CDVInvokedUrlCommand*)command
{
    // Not implemented yet
}

-(void) consoleLog:(CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    M360SDKLogVerbose(@"js-log : %@", args);
}

#pragma mark - Callback

-(void) callback:(NSDictionary*)callbackDict
{
    if (_callBackID) {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:callbackDict];
        
        [result setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:result callbackId:_callBackID];
    }
}

#pragma mark - utils

-(NSString *) getNonNulledString:(id) str
{
    if(str == nil || [str isKindOfClass:[NSNull class]])
        return @"";
    
    return getTrimmedString(str);
}

-(NSDictionary*)getDictionaryFromJSON:(NSString*)jsonString
{
    NSError *error;
    
    NSDictionary *response = [NSJSONSerialization JSONObjectWithData:[jsonString dataUsingEncoding:NSUTF8StringEncoding] options:NSJSONReadingMutableContainers error:&error];
    
    if (!error) {
        return response;
    }
    
    return nil;
}

+(NSString*)sdkStateToString:(MaaS360SDKState)state
{
    NSString *stateString = @"";
    
    switch (state) {
        case MaaS360SDKStateNull:
            stateString = ksdkStateNotConfigured;
            break;
        case MaaS360SDKStateActivated:
            stateString = ksdkStateActivated;
            break;
        case MaaS360SDKStateAppNotInstalled:
            stateString = ksdkStateMaaSAppNotInstalled;
            break;
        case MaaS360SDKStateNotActivated:
            stateString = ksdkStateNotActivated;
            break;
        case MaaS360SDKStateNotRelevant:
            stateString = ksdkStateNotRelevant;
            break;
        case MaaS360SDKStateRecovery:
            stateString = ksdkStateRecovery;
            break;
        default:
            break;
    }
    
    return stateString;
}

#pragma mark -

- (void) initMaaS360SDKWithConfig:(NSDictionary *) config
{
    NSString *develoeperKey = @"";
    NSString *licenseKey = @"";
	BOOL enableAnalytics = false;
	
    if (config != nil)
    {
        develoeperKey = [config valueForKey:kDeveloperKey];
        licenseKey = [config valueForKey:klicenseKey];
        enableAnalytics = [[config valueForKey:kEnableAnalytics] boolValue];
    }
    
    M360SDKConfig *sdkConfig = [[M360SDKConfig alloc] init];
    sdkConfig.developerID = develoeperKey;
    sdkConfig.licenseKey = licenseKey;
    sdkConfig.logLevel = LogLevelInfo;
    sdkConfig.isAnalyticsV2Enabled = enableAnalytics;
    
    NSError *error;
    if (![MaaS360SDK canInitWithSDKConfig:sdkConfig error:&error])
    {
        NSLog(@"SDK cannot be initialized since %@", [error localizedDescription]);
        return;
    }
    
    void (^completion)(NSError *) = ^(NSError *error){
        if (error) {
            NSLog(@"SDK cannot be initiailized since %@",[error localizedDescription]);
            return;
        }
        
        MaaS360SDKState state = [_m360SDK sdkState];
        
        if (state == MaaS360SDKStateActivated || state == MaaS360SDKStateNotRelevant)
        {
            [_m360SDK startSDKOperations];
            BOOL bDeviceInWipeState = [M360SDKUtils isDeviceInWipeState];
            if (MaaS360SDKStateActivated == state && bDeviceInWipeState)
            {
                [self postWipeEvent];
            }
            else {
                [self postDoneEnrollingEvent];
            }
        }
        else
        {
            NSString *activationMode = [M360SDKUtils getPreferredSDKActivationMode];
            BOOL activateInNoMaasMode = false;
            
            if(([activationMode caseInsensitiveCompare:ksdkStandAloneActivation] == NSOrderedSame)  ||
               (state == MaaS360SDKStateAppNotInstalled && ([activationMode caseInsensitiveCompare:ksdkOptionalMaaSBasedActivation] == NSOrderedSame)))
            {
                activateInNoMaasMode = YES;
            }
            
            //activation logic
            if(activateInNoMaasMode || state != MaaS360SDKStateAppNotInstalled)
            {
                
                [self postEnrollingEvent];
                [_m360SDK bootstrapSDKWithCompletionHandler:^(MaaS360SDKState state) {
                    [self onSDKStateChange:state];
                }];
            }
            else
            {
                [self postNotInstalledEvent];
            }
            
        }
    };

    _m360SDK = [MaaS360SDK shared];
    [_m360SDK setDelegate:self];
    BOOL bRet = [_m360SDK setAndValidateSDKConfiguration:sdkConfig withCompletionBlock:completion];
    if(!bRet)
    {
        return;
    }
    
    [_m360SDK setAppInfo:@{ksdkAppTypeKey: ksdkAppTypeHybrid}];
}


#pragma mark - MaaS360SDKDelegate methods

- (void) onSDKStateChange:(MaaS360SDKState)state
{
    if (state == MaaS360SDKStateActivated ||
        state == MaaS360SDKStateNotRelevant)
    {
        [_m360SDK startSDKOperations];
        [self postDoneEnrollingEvent];
    }
    else if(state == MaaS360SDKStateAppNotInstalled)
    {
        _lastReportedAppConfig = nil;
        [self postNotInstalledEvent];
    }
    else
    {
        _lastReportedAppConfig = nil;
        [self postNotEnrolledEvent];
    }
    
    
    [self postSDKStateChange:state];
    
}

- (void) sdkStateChangedTo:(MaaS360SDKState)state
{
    [self onSDKStateChange:state];
}

- (void) complianceStateChangedTo:(M360SDKComplianceInfo *)state
{
    if(state.complianceState == M360ComplianceStateOutOfCompliance)
    {
        [self postOOCEvent:state.outOfComplianceReasons];
    }
    else
    {
        [self postComplianceStateChange:state];
    }
}
- (void) containerLockedStatusChanged
{
    [self postContainerLockStatusChanged];
}

- (void) isGatewayConnected
{
    [self postEnterpriseGatewayStatus:@{kEGStatus: kNotifyEGLoginCredentials}];
}

- (void) restrictDataSharing:(BOOL)on withWhiteListedApps:(NSArray *)apps
{
    M360SDKLogInfo(@"Data sharing: %c", on);
}

- (void) newPolicyAvailable
{
    [self postNewPolicyAvailable];
}

-(void) policyEntitlementsChanged
{
    M360SDKLogInfo(@"Policy Entitlements Changed");
}

- (void) wipeData
{
    [self postWipeEvent];
}

- (void) revokeWipedData
{
    [self postDoneWipeEvent];
}

- (void) EGLoginSuccessful
{
    [self postEnterpriseGatewayStatus:@{kEGStatus: kNotifyEGLogin}];
}

- (void) EGLogoutSuccessful
{
    [self postEnterpriseGatewayStatus:@{kEGStatus: kNotifyEGLogout}];
}

- (void) EGErrorOccured:(NSString *) error
{
    [self postEnterpriseGatewayStatus:@{kEGStatus: kNotifyEGLoginError,
                                        kEGErrorReason: error}];
}

- (NSDictionary*) EGAuthCredentials
{
    [self postEnterpriseGatewayStatus:@{kEGStatus: kNotifyEGLoginCredentials}];
    return nil;
}

-(void) presentEnrollmentUI:(UINavigationController *)controller
{
    [self postEnrollingEvent];
    
}

-(void) dismissEnrollmentUI
{
    [self postDoneEnrollingEvent];
    
    MaaS360SDKState state = [_m360SDK sdkState];
    
    if (state != MaaS360SDKStateActivated) {
        [self postNotEnrolledEvent];
    }
    
}

-(void) newConfigurationAvailable:(NSData*)configData
{
    NSString *config = @"";
    if([configData length] > 0)
    {
        //config = [configData base64EncodedString]; -- Android app sending String
        config = [[NSString alloc] initWithData:configData encoding:NSUTF8StringEncoding];
    }

    if (![config isEqualToString:_lastReportedAppConfig])
    {
        [self postConfigurationAvailable:config];
        _lastReportedAppConfig = config;
    }
}

- (void) generateKey:(CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    M360SDKResourceInfo *resourceInfo = [[M360SDKResourceInfo alloc] init];
    if (params && ![params isEqual:[NSNull null]])
    {
        NSString *resourceKey = [self getNonNulledString:params[kResourceKey]];
        NSString *resourceType = [self getNonNulledString:params[kResourceType]];
        NSString *dataClassType = [self getNonNulledString:params[kDataClassType]];
        if([resourceKey length] >0)
            resourceInfo.resourceKey = resourceKey;
        else {
            NSDictionary *InvalidApiCall = @{@"status": @"UnsupportedApiCall"};
            [self callback:@{kNotifyCallbackId:kUnsupportedApiCall,
                             kNotifyCallbackValue:InvalidApiCall}];
        }
        
        if([resourceType caseInsensitiveCompare:@"M360SDKdb"])
            resourceInfo.resourceType = M360SDKdb;
        else if([resourceType caseInsensitiveCompare:@"M360SDKfile"])
            resourceInfo.resourceType = M360SDKfile;
        else if([resourceType caseInsensitiveCompare:@"M360SDKdata"])
            resourceInfo.resourceType = M360SDKdata;
        else{
            resourceType = @"M360SDKdata";
            resourceInfo.resourceType = M360SDKdata;
        }
        
        if([dataClassType caseInsensitiveCompare:@"M360SDKAppData"])
            resourceInfo.dataClassType = M360SDKAppData;
        else if([dataClassType caseInsensitiveCompare: @"M360SDKUserData"])
            resourceInfo.dataClassType = M360SDKUserData;
        else {
            dataClassType = @"M360SDKAppData";
            resourceInfo.dataClassType = M360SDKAppData;
        }
        
        NSMutableDictionary *resourceInfoObj = [[NSMutableDictionary alloc] init];
        [resourceInfoObj setObject:resourceKey forKey:kResourceKey];
        [resourceInfoObj setObject:resourceType forKey:kResourceType];
        [resourceInfoObj setObject:dataClassType forKey:kDataClassType];
        
        if(resourceInfo != nil)
            [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
                switch (eventType) {
                    case M360SDKKeyAvailable: {
                        NSMutableDictionary *key_info_obj = [[NSMutableDictionary alloc] init];
                        NSString *encData = [[keyInfo getEncryptionKey] base64EncodedStringWithOptions:0];
                        [key_info_obj setObject:encData forKey:kEncryptionKey];
                        [key_info_obj setObject:resourceInfoObj forKey:kResourceInfo];
                        [self callback:@{kNotifyCallbackId:kNotifyKeyAvailable,
                                         kNotifyCallbackValue:key_info_obj}];
                        break;
                    }
                    case M360SDKKeyUnvailable: {
                        M360SDKLogInfo(@"Failed to generate key [Resource Key: '%@' Type: '%@' Data Type: '%@' Reason: Key is unavailable]",
                                resourceKey, resourceType, dataClassType);
                        NSMutableDictionary *key_info_obj = [[NSMutableDictionary alloc] init];
                        [key_info_obj setObject:resourceInfoObj forKey:kResourceInfo];
                        
                        [self callback:@{kNotifyCallbackId:kNotifyKeyUnAvailable,
                                         kNotifyCallbackValue:key_info_obj}];
                        break;
                    }
                    case M360SDKKeyDestroyed: {
                        M360SDKLogInfo(@"Failed to generate key [Resource Key: '%@' Type: '%@' Data Type: '%@' Reason: Key was destroyed]",
                                resourceKey, resourceType, dataClassType);
                        NSMutableDictionary *key_info_obj = [[NSMutableDictionary alloc] init];
                        [key_info_obj setObject:resourceInfoObj forKey:kResourceInfo];
                        
                        [self callback:@{kNotifyCallbackId:kNotifyKeyDestroyed,
                                         kNotifyCallbackValue:key_info_obj}];
                        
                        break;
                    }
                    case M360SDKKeyError: {
                        // Error will happen with shared key and MaaS360 app version < 2.98
                        break;
                    }
                }
            }];
    }
    M360SDKLogInfo(@"Generate Key finish");
}

#pragma mark - Encryption utils

- (NSString *)encryptionKeyOfLength:(NSUInteger)length fromString:(NSString *)string
{
    if (length == 0)
    {
        return nil;
    }
    if (string.length > length)
    {
        return [string substringToIndex:length];
    }
    else if (string.length == length)
    {
        return string;
    }
    else
    {
        return [string stringByPaddingToLength:length withString:@"0" startingAtIndex:0];
    }
}

-(NSString *) getDocumentsDirectory
{
    NSArray *pathArray = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [pathArray objectAtIndex:0];
    return documentsDirectory;
}

-(NSString *) getDocumentsDirectoryPathForFile:(NSString *) file
{
    NSString *absolutePath = @"";
    NSString *docDir = [self getDocumentsDirectory];
    if(file)
    {
        absolutePath = [NSString stringWithFormat:@"%@/%@",docDir,file];
    }
    return absolutePath;
}

#pragma mark - Encryption API calls

- (void) encryptText : (CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    if (params && ![params isEqual:[NSNull null]])
    {
        // GET data to enc
        NSString *strToEncrypt = [self getNonNulledString:params[kStrToEncrypt]];
        NSString *callbackId = [self getNonNulledString:params[kNotifyCallbackPointerId]];

        // GET Encryption key
        M360SDKResourceInfo *resourceInfo = getSDKUserProtectionResource();
        
        [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
            switch (eventType) {
                case M360SDKKeyAvailable: {
                    NSData *encKEY = [keyInfo getEncryptionKey];
                    NSString *encryptedData = [M360SDKEncryptionUtils base64AfterAES256WithCBCModeEncryptionWithKey:encKEY forString:strToEncrypt];
                    NSDictionary *eventData = @{kNotifyCallbackValueResult :encryptedData,
                                                kNotifyCallbackPointerId:callbackId};
                    [self callback:@{kNotifyCallbackId:kEncryptionTextComplete,
                                     kNotifyCallbackValue:eventData}];
                    break;
                }
                case M360SDKKeyUnvailable: {
                    M360SDKLogError(@"Failed to encrypt text [Reason: Key is unavailable]");
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key unavailable",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kEncryptionTextComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyDestroyed: {
                    M360SDKLogError(@"Failed to encrypt text [Reason: Key was destroyed]");
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key was destroyed",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kEncryptionTextComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyError: {
                    M360SDKLogError(@"Failed to encrypt text due to an internal error");
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kEncryptionTextComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                }
            }
        }];
    }
}

- (void) decryptText : (CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    if (params && ![params isEqual:[NSNull null]])
    {
        // GET data to enc
        NSString *strToDecrypt = [self getNonNulledString:params[kStrToDecrypt]];
        NSString *callbackId = [self getNonNulledString:params[kNotifyCallbackPointerId]];

        if ([strToDecrypt length] == 0)
        {
            if (callbackId) {
                NSDictionary *eventData = @{kNotifyCallbackValueError : @"Empty string for decryption",
                                            kNotifyCallbackPointerId : callbackId};
                [self callback:@{kNotifyCallbackId:kDecryptionTextComplete,
                                 kNotifyCallbackValue:eventData}];
            }
            M360SDKLogError(@"Failed to decrypt encrypted text [Reason: Empty text]");
            return;
        }

        // GET Encryption key
        M360SDKResourceInfo *resourceInfo = getSDKUserProtectionResource();
        
        [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
            switch (eventType) {
                case M360SDKKeyAvailable: {
                    NSData *decKEY = [keyInfo getEncryptionKey];
                    NSString *decryptedStr = [M360SDKEncryptionUtils stringAfterAES256WithCBCModeDecryptionWithKey:decKEY forBase64:strToDecrypt];
                    NSDictionary *eventData = @{kNotifyCallbackValueResult:decryptedStr,
                                                kNotifyCallbackPointerId:callbackId};
                    [self callback:@{kNotifyCallbackId:kDecryptionTextComplete,
                                     kNotifyCallbackValue:eventData}];
                    break;
                }
                case M360SDKKeyUnvailable: {
                    M360SDKLogError(@"Failed to decrypt encrypted text [Reason: Key is unavailable]");
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key unavailable",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kDecryptionTextComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyDestroyed: {
                    M360SDKLogError(@"Failed to decrypt encrypted text [Reason: Key was destroyed]");
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key was destroyed",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kDecryptionTextComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyError: {
                    M360SDKLogError(@"Failed to decrypt encrypted text due to an internal error");
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kDecryptionTextComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                }
            }
        }];
    }
    
}

- (void) writeEncryptedFile : (CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    if (params && ![params isEqual:[NSNull null]])
    {
        NSString *textToWrite = [self getNonNulledString:params[kTextToWrite]];
        NSString *fileName = [self getNonNulledString:params[kFileName]];
        NSString *callbackId = [self getNonNulledString:params[kNotifyCallbackPointerId]];

        if ([fileName length] == 0)
        {
            if (callbackId) {
                NSDictionary *eventData = @{kNotifyCallbackValueError : @"File name is empty",
                                            kNotifyCallbackPointerId : callbackId};
                [self callback:@{kNotifyCallbackId:kWriteEncryptedFileComplete,
                                 kNotifyCallbackValue:eventData}];
            }
            M360SDKLogError(@"Failed to write encrypted data to file [Reason: File name is empty]");
            return;
        }

        NSString *targetFilePath = [self getDocumentsDirectoryPathForFile:fileName];
        NSString *sourceFilePath = getUniqueTempFilePath();        
        //Creating base.txt with the content given by user
        [textToWrite writeToFile:sourceFilePath atomically:YES encoding: NSUTF8StringEncoding error: NULL];
        
        // GET Encryption key
        M360SDKResourceInfo *resourceInfo = getSDKUserProtectionResource();
        
        [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
            switch (eventType) {
                case M360SDKKeyAvailable: {
                    NSData *encKey = [keyInfo getEncryptionKey];
                    //encrypting contents of base.txt and putting it in the filename given by user - to be decrypted later
                    if ([M360SDKEncryptionUtils encryptFileUsingAES256WithCBCModeAt:sourceFilePath to:targetFilePath withKey:encKey])
                    {
                        removeFile(sourceFilePath);
                        if (callbackId) {
                            NSDictionary *eventData = @{kNotifyCallbackPointerId : callbackId};
                            [self callback:@{kNotifyCallbackId:kWriteEncryptedFileComplete,
                                             kNotifyCallbackValue:eventData}];
                        }
                    }
                    else {
                        if (callbackId) {
                            NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                        kNotifyCallbackPointerId : callbackId};
                            [self callback:@{kNotifyCallbackId:kWriteEncryptedFileComplete,
                                             kNotifyCallbackValue:eventData}];
                        }
                        M360SDKLogError(@"Failed to write encrypted data to file '%@' [Reason: Internal error]", fileName);
                    }
                    break;
                }
                case M360SDKKeyUnvailable: {
                    M360SDKLogError(@"Failed to write encrypted data to file '%@' [Reason: Key is unavailable]", fileName);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key unavailable",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kWriteEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyDestroyed: {
                    M360SDKLogError(@"Failed to write encrypted data to file '%@' [Reason: Key was destroyed]", fileName);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key was destroyed",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kWriteEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyError: {
                    M360SDKLogError(@"Failed to write encrypted data to file '%@' [Reason: Internal error]", fileName);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kWriteEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                }
            }
        }];
    }
}

- (void) encryptFileAtPath:(CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    if (params && ![params isEqual:[NSNull null]])
    {
        NSString *filePath = [self getNonNulledString:params[kFilePath]];
        NSString *callbackId = [self getNonNulledString:params[kNotifyCallbackPointerId]];

        NSString *srcFilePath = getSystemFilePath(filePath);
        if (nil == srcFilePath)
        {
            if (callbackId) {
                NSDictionary *eventData = @{kNotifyCallbackValueError : @"File not found",
                                            kNotifyCallbackPointerId : callbackId};
                [self callback:@{kNotifyCallbackId:kEncryptFileAtPathComplete,
                                 kNotifyCallbackValue:eventData}];
            }
            M360SDKLogError(@"Failed to encrypt file at path '%@' [Reason: File not found]", filePath);
            return;
        }
        
        // GET Encryption key
        M360SDKResourceInfo *resourceInfo = getSDKUserProtectionResource();
        
        [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
            switch (eventType) {
                case M360SDKKeyAvailable: {
                    NSData *encKey = [keyInfo getEncryptionKey];
                    NSString *destTempFilePath = getUniqueTempFilePath();
                    //encrypting contents of base.txt and putting it in the filename given by user - to be decrypted later
                    if ([M360SDKEncryptionUtils encryptFileUsingAES256WithCBCModeAt:srcFilePath to:destTempFilePath withKey:encKey])
                    {
                        if (moveFile(destTempFilePath, srcFilePath)) {
                            if (callbackId) {
                                NSDictionary *eventData = @{kNotifyCallbackPointerId : callbackId};
                                [self callback:@{kNotifyCallbackId:kEncryptFileAtPathComplete,
                                                 kNotifyCallbackValue:eventData}];
                            }
                        }
                        else {
                            if (callbackId) {
                                NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                            kNotifyCallbackPointerId : callbackId};
                                [self callback:@{kNotifyCallbackId:kEncryptFileAtPathComplete,
                                                 kNotifyCallbackValue:eventData}];   
                            }
                            M360SDKLogError(@"Failed to encrypt file at path '%@' [Reason: Internal error]", filePath);
                        }
                    }
                    break;
                }
                case M360SDKKeyUnvailable: {
                    M360SDKLogError(@"Failed to encrypt file at path '%@' [Reason: Key is unavailable]", filePath);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key unavailable",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kEncryptFileAtPathComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyDestroyed: {
                    M360SDKLogError(@"Failed to encrypt file at path '%@' [Reason: Key was destroyed]", filePath);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key was destroyed",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kEncryptFileAtPathComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyError: {
                    M360SDKLogError(@"Failed to encrypt file at path '%@' [Reason: internal error]", filePath);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kEncryptFileAtPathComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                }
            }
        }];
    }
}

- (void) readEncryptedFile : (CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    if (params && ![params isEqual:[NSNull null]])
    {
        NSString *fileName = [self getNonNulledString:params[kFileName]];
        NSString *callbackId = [self getNonNulledString:params[kNotifyCallbackPointerId]];

        if ([fileName length] == 0)
        {
            if (callbackId) {
                NSDictionary *eventData = @{kNotifyCallbackValueError : @"File name is empty",
                                            kNotifyCallbackPointerId : callbackId};
                [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                 kNotifyCallbackValue:eventData}];
            }
            M360SDKLogError(@"Failed to read encrypted data from file [Reason: File name is empty]");
            return;
        }

        NSString *encryptedFilePath = [self getDocumentsDirectoryPathForFile:fileName];
        if (nil == getSystemFilePath(encryptedFilePath))
        {
            if (callbackId) {
                NSDictionary *eventData = @{kNotifyCallbackValueError : @"File not found",
                                            kNotifyCallbackPointerId : callbackId};
                [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                 kNotifyCallbackValue:eventData}];
            }
            M360SDKLogError(@"Failed to read encrypted data from file '%@' [Reason: File not found]", fileName);
            return;
        }

        // GET Encryption key
        M360SDKResourceInfo *resourceInfo = getSDKUserProtectionResource();
        
        [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
            switch (eventType) {
                case M360SDKKeyAvailable: {
                    NSData *encKey = [keyInfo getEncryptionKey];
                    
                    NSString *tempFilePath = getUniqueTempFilePath();
                    //decrypting file data given by user and decrypted data stored in (result.txt) back to base.txt
                    if([M360SDKEncryptionUtils decryptFileUsingAES256WithCBCModeAt:encryptedFilePath to:tempFilePath withKey:encKey])
                    {
                        NSString *fileContents = [NSString stringWithContentsOfFile:tempFilePath encoding:NSUTF8StringEncoding error:nil];
                        NSDictionary *eventData = @{kNotifyCallbackValueResult:fileContents,
                                                    kNotifyCallbackPointerId:callbackId};
                        
                        removeFile(tempFilePath);
                        
                        [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    else {
                        if (callbackId) {
                            NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                        kNotifyCallbackPointerId : callbackId};
                            [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                             kNotifyCallbackValue:eventData}];
                        }
                        M360SDKLogError(@"Failed to read encrypted data from file '%@' [Reason: Internal error]", fileName);
                    }
                    break;
                }
                case M360SDKKeyUnvailable: {
                    M360SDKLogError(@"Failed to read encrypted data from file '%@' [Reason: Key is unavailable]", fileName);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key unavailable",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyDestroyed: {
                    M360SDKLogError(@"Failed to read encrypted data from file '%@' [Reason: Key was destroyed]", fileName);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Encryption key was destroyed",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyError: {
                    M360SDKLogError(@"Failed to read encrypted data from file '%@' [Reason: internal error]", fileName);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kReadEncryptedFileComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                }
            }
        }];
        
    }
}

- (void) decryptFileAtPath : (CDVInvokedUrlCommand*)command
{
    NSArray *args = [command arguments];
    
    NSDictionary *params;
    if ([args count] > 0) {
        params = [args firstObject];
    }
    
    if (params && ![params isEqual:[NSNull null]])
    {
        NSString *filePath = [self getNonNulledString:params[kFilePath]];
        NSString *callbackId = [self getNonNulledString:params[kNotifyCallbackPointerId]];

        NSString *encryptedFilePath = getSystemFilePath(filePath);
        if (nil == encryptedFilePath)
        {
            if (callbackId) {
                NSDictionary *eventData = @{kNotifyCallbackValueError : @"File not found",
                                            kNotifyCallbackPointerId : callbackId};
                [self callback:@{kNotifyCallbackId:kDecryptFileAtPathComplete,
                                 kNotifyCallbackValue:eventData}];
            }
            M360SDKLogError(@"Failed to decrypt file at path '%@' [Reason: File not found]", filePath);
            return;
        }
        
        // GET Encryption key
        M360SDKResourceInfo *resourceInfo = getSDKUserProtectionResource();
        
        [[M360SDKKeyManager shared] manageResourcewithInfo:resourceInfo withEventHandler:^(M360SDKKeyEventType eventType,M360SDKKeyInfo *keyInfo) {
            switch (eventType) {
                case M360SDKKeyAvailable: {
                    NSData *encKey = [keyInfo getEncryptionKey];
                    NSString *tempFilePath = getUniqueTempFilePath();
                    //decrypting file data given by user and decrypted data stored in (result.txt) back to base.txt
                    if([M360SDKEncryptionUtils decryptFileUsingAES256WithCBCModeAt:encryptedFilePath to:tempFilePath withKey:encKey])
                    {
                        if (moveFile(tempFilePath, encryptedFilePath)) {
                            if (callbackId) {
                                NSDictionary *eventData = @{kNotifyCallbackPointerId : callbackId};
                                [self callback:@{kNotifyCallbackId:kDecryptFileAtPathComplete,
                                                 kNotifyCallbackValue:eventData}];
                            }
                        }
                        else {
                            if (callbackId) {
                                NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                            kNotifyCallbackPointerId : callbackId};
                                [self callback:@{kNotifyCallbackId:kDecryptFileAtPathComplete,
                                                 kNotifyCallbackValue:eventData}];   
                            }
                            M360SDKLogError(@"Failed to decrypt file at path '%@' [Reason: Internal error]", filePath);
                        }
                    }
                    break;
                }
                case M360SDKKeyUnvailable: {
                    M360SDKLogError(@"Failed to decrypt file at path '%@' [Reason: Key is unavailable]", encryptedFilePath);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Decryption key unavailable",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kDecryptFileAtPathComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyDestroyed: {
                    M360SDKLogError(@"Failed to decrypt file at path '%@' [Reason: Key was destroyed]", encryptedFilePath);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Decryption key was destroyed",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kDecryptFileAtPathComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                    break;
                }
                case M360SDKKeyError: {
                    M360SDKLogError(@"Failed to decrypt file at path '%@' [Reason: internal error]", encryptedFilePath);
                    if (callbackId) {
                        NSDictionary *eventData = @{kNotifyCallbackValueError : @"Internal error",
                                                    kNotifyCallbackPointerId : callbackId};
                        [self callback:@{kNotifyCallbackId:kDecryptFileAtPathComplete,
                                         kNotifyCallbackValue:eventData}];
                    }
                }
            }
        }];
    }
}

#pragma mark - authentication delegate events

- (void) sendAuthRequest:(NSDictionary*)details
{
    NSDictionary *loginInfo = nil;
    if (details) {
        NSString *userName = [self getNonNulledString:[details objectForKey:kEGLoginUserName]];
        NSString *password = [self getNonNulledString:[details objectForKey:kEGLoginPassword]];
        NSString *domain = [self getNonNulledString:[details objectForKey:kEGLoginDomainName]];
        
        loginInfo =  @{kEnterpriseUserName:userName, kEnterprisePassword:password , kEnterpriseDomain:domain};
    }
    [[MaaS360SDK shared] startEnterpriseGatewayWithLoginInfo:loginInfo];
}

#pragma mark - event functions

-(void) postConfigurationAvailable:(NSString *) config
{
    [self callback:@{kNotifyCallbackId: kNotifyConfigAvailable, kNotifyCallbackValue: config}];
}

-(void) postNotInstalledEvent
{
    [self callback:@{kNotifyCallbackId: kNotifyActivationStateChange,
                     kNotifyCallbackValue: ksdkStateMaaSAppNotInstalled}];
}

- (void) postSDKStateChange:(MaaS360SDKState)state
{
    NSDictionary *stateChangeDict = @{kNotifyCallbackId:kNotifyActivationStateChange,
                                      kNotifyCallbackValue:[[self class] sdkStateToString:state]};
    [self callback:stateChangeDict];
}

-(void) postNewPolicyAvailable
{
    NSDictionary *sdkInfo = [_m360SDK getSDKInfo];
    if ([sdkInfo count] == 0) {
        M360SDKLogError(@"Failed to post new policy available event [Reason: SDK information is unavailable]");
        return;
    }

    NSDictionary *policyInfo = @{kM360AppliedPolicyName: sdkInfo[kM360AppliedPolicyName],
                                 kM360AppliedPolicyVersion: sdkInfo[kM360AppliedPolicyVersion],
                                 kM360WhiteListedAppsKey: sdkInfo[kM360WhiteListedAppsKey]};
    
    [self callback:@{kNotifyCallbackId:kNotifyPolicyAvailable,
                     kNotifyCallbackValue:policyInfo}];
}

-(void) postEnterpriseGatewayStatus:(NSDictionary*)value
{
    [self callback:@{kNotifyCallbackId:kNotifyEnterpriseGateway,
                     kNotifyCallbackValue:value}];
}

-(void) postNotEnrolledEvent
{
    [self callback:@{kNotifyCallbackId: kNotifyActivationStateChange,
                     kNotifyCallbackValue: ksdkStateNotEnrolled}];
    
}

-(void) postDoneEnrollingEvent
{
    [self callback:@{kNotifyCallbackId: kNotifyActivationStateChange,
                     kNotifyCallbackValue: ksdkStateActivated}];
    
}

-(void) postEnrollingEvent
{
    [self callback:@{kNotifyCallbackId: kNotifyActivationStateChange,
                     kNotifyCallbackValue: ksdkStateConfiguring}];
}

-(void) postWipeEvent
{
    NSDictionary *sdkInfo = [_m360SDK getSDKInfo];
    if ([sdkInfo count] == 0) {
        M360SDKLogError(@"Failed to selective wipe event [Reason: SDK information is unavailable]");
        return;
    }
    
    [self callback:@{kNotifyCallbackId: kNotifySelectiveWipeChange,
                     kNotifyCallbackValue: @{kSelectiveWipeStatusKey: kNotifySWApplied,
                                             kBlockContainer: @"true",
                                             kSelectiveWipeReasonKey: [self getNonNulledString:sdkInfo[kM360OOCComplianceReason]]}}];
}

-(void) postDoneWipeEvent
{
    [self callback:@{kNotifyCallbackId: kNotifySelectiveWipeChange,
                     kNotifyCallbackValue: @{kSelectiveWipeStatusKey: kNotifySWRevoked}}];
}

-(void) postOOCEvent:(NSArray *) oocReasons
{
    NSDictionary *sdkInfo = [_m360SDK getSDKInfo];
    if ([sdkInfo count] == 0) {
        M360SDKLogError(@"Failed to post OOC event [Reason: SDK information is unavailable]");
        return;
    }
    
    if (oocReasons == nil) {
        oocReasons = [[NSArray alloc] init];
    }
    [self callback:@{kNotifyCallbackId:kNotifyComplianceChange,
                     kNotifyCallbackValue:@{kM360OOCComplianceReason:oocReasons,
                                            kM360ComplianceStatus: sdkInfo[kM360ComplianceStatus]}}];
    
}

-(void) postComplianceStateChange:(M360SDKComplianceInfo*)complianceInfo
{
    NSDictionary *sdkInfo = [_m360SDK getSDKInfo];
    if ([sdkInfo count] == 0) {
        M360SDKLogError(@"Failed to post compliance state change event [Reason: SDK information is unavailable]");
        return;
    }
    
    NSDictionary *compInfo = @{
                               kM360AuthEnforcementTimeout: sdkInfo[kM360AuthEnforcementTimeout],
                               kM360JBRestrictionEnforcementStatus: sdkInfo[kM360JBRestrictionEnforcementStatus],
                               kM360CopyPasteRestrictionEnforcementStatus: sdkInfo[kM360CopyPasteRestrictionEnforcementStatus],
                               kM360DataExportRestrictionEnforcementNeededKey: sdkInfo[kM360DataExportRestrictionEnforcementNeededKey],
                               kM360ComplianceStatus: sdkInfo[kM360ComplianceStatus],
                               kM360OOCComplianceReason: sdkInfo[kM360OOCComplianceReason]
                               };
    
    [self callback:@{kNotifyCallbackId:kNotifyComplianceChange,
                     kNotifyCallbackValue:compInfo}];
    
}
-(void) postContainerLockStatusChanged
{
    NSDictionary *sdkInfo = [_m360SDK getSDKInfo];
    if ([sdkInfo count] == 0) {
        M360SDKLogError(@"Failed to post container lock status change event [Reason: SDK information is unavailable]");
        return;
    }

    NSNumber *value = @NO;
    NSString *lockStatus = sdkInfo[kM360ContainerLockedStatus];
    if ([[lockStatus lowercaseString] isEqualToString:@"yes"])
    {
        value = @YES;
    }
    
    [self callback:@{kNotifyCallbackId:kNotifyContainerLockStatusChange,
                     kNotifyCallbackValue:value}];
}
@end
