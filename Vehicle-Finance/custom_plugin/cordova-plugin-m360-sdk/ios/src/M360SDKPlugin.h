//
//  M360SDKPlugin.h
//
//  Created by Vinay Raja on 03/02/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface M360SDKPlugin : CDVPlugin

- (void) initializeSDK:(CDVInvokedUrlCommand *)command;

- (void) getSDKInfo:(CDVInvokedUrlCommand *)command;

- (void) getAppConfiguration:(CDVInvokedUrlCommand *)command;

- (void) startEnterpriseGateway:(CDVInvokedUrlCommand*)command;

- (void) saveDocument:(CDVInvokedUrlCommand*)command;

- (void) composeMail:(CDVInvokedUrlCommand*)command;

- (void) openURL:(CDVInvokedUrlCommand*)command;

- (void) consoleLog:(CDVInvokedUrlCommand*)command;

- (void) containerLockedStatusChanged;

- (void) generateKey:(CDVInvokedUrlCommand*)command;

- (void) encryptText : (CDVInvokedUrlCommand*)command;
- (void) decryptText : (CDVInvokedUrlCommand*)command;

- (void) writeEncryptedFile : (CDVInvokedUrlCommand*)command;
- (void) readEncryptedFile : (CDVInvokedUrlCommand*)command;

- (void) encryptFileAtPath:(CDVInvokedUrlCommand*)command;
- (void) decryptFileAtPath : (CDVInvokedUrlCommand*)command;
@end
