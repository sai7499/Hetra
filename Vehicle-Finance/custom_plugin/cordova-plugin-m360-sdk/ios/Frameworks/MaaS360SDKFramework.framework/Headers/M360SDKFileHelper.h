//
//  M360SDKFileHelper.h
//  MaaS360SDK
//
//  Created by Vinay Raja on 20/02/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "M360SDKBaseClass.h"

@interface M360SDKFileHelper : NSObject<M360SDKBaseClass>

+(BOOL) encryptFileAtPath:(NSString *)sourcefilePath copyTo:(NSString *)destFilePath withKeyInfo: (NSData *) key;

+(BOOL) decryptFileAtPath:(NSString *)sourcefilePath copyTo:(NSString *)destFilePath withKeyInfo: (NSData *) key;

@end
