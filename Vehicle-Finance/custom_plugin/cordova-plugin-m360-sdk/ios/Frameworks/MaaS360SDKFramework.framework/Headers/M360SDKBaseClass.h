//
//  M360SDKBaseClass.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 10/5/15.
//  Copyright © 2015 Fiberlink. All rights reserved.
//

#ifndef M360SDKBaseClass_h
#define M360SDKBaseClass_h

#import <Foundation/Foundation.h>

@protocol M360SDKBaseClass <NSObject>

@optional

//These are dummy methods, no service implements anything as of now.

-(void) getObjectVersion;
-(BOOL) isRestorable;
-(void) restoreFromData:(NSData *) data;

@end


#endif /* M360SDKBaseClass_h */
