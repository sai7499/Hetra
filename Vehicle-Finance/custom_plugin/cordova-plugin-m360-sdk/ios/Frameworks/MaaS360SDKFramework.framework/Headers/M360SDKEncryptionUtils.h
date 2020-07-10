//
//  M360SDKEncryptionUtils.h
//  MaaS360SDK
//
//  Created by Lakshmi Prathyusha N on 2/26/16.
//  Copyright (c) 2016 Fiberlink. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "M360SDKBaseClass.h"


@interface M360SDKEncryptionUtils : NSObject<M360SDKBaseClass>

+ (NSString *)base64AfterAES256WithCBCModeEncryptionWithKey:(NSData *)key forString:(NSString*)dataString;
+ (NSString *)stringAfterAES256WithCBCModeDecryptionWithKey:(NSData *)key forBase64:(NSString *)encodedString;
+ (BOOL)encryptFileUsingAES256WithCBCModeAt:(NSString *)sourceFilePath to:(NSString *)targetFilePath withKey:(NSData *)key;
+ (BOOL)decryptFileUsingAES256WithCBCModeAt:(NSString *)sourceFilePath to:(NSString *)targetFilePath withKey:(NSData *)key;

@end

