//
//  FLCODeviceUtils.h
//  FLUICommons
//
//  Created by Mudireddy Suresh on 10/03/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "FLCOGenericUtils.h"
#import "FLCOAlertViewContext.h"
#import "FLCOAlertViewManager.h"

@interface FLCOCameraUtils : NSObject

+ (BOOL) isCameraRestricted;
+ (BOOL) isCameraRestrictedAndShowAlertMessage;
+ (void) cameraRestrictedPolicyAndShowAlertMessage:(NSString*)message;

@end
