//
//  M360SDKKeyInfo.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 10/5/15.
//  Copyright © 2015 Fiberlink. All rights reserved.
//

#ifndef M360SDKKeyInfo_h
#define M360SDKKeyInfo_h

#import "M360SDKBaseClass.h"
#import <Foundation/Foundation.h>
#import "M360SDKConstants.h"
#import "M360SDKResourceInfo.h"


#endif /* M360SDKKeyInfo_h */

/*
 
 This object never needs to be instantiated by the app, will be created by the sdk and passed as an output of M360SDKKeyManager functions.
 
 */

@interface M360SDKKeyInfo : NSObject<M360SDKBaseClass>
{
}

-(instancetype)initWithInfo:(id)info;

@property(nonatomic,readonly) M360SDKKeyType keyType;

/*
 Encryption key associated with the resource.
 */
-(NSData *) getEncryptionKey;

@end
