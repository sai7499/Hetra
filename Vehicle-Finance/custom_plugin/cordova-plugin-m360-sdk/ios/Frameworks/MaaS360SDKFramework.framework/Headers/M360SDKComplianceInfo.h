//
//  M360SDKComplianceInfo.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 27/05/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "M360SDKConstants.h"

@interface M360SDKComplianceInfo : NSObject

// The compliance state.
@property (nonatomic, assign) M360SDKComplianceState complianceState;

// Compliance Event ID
@property (nonatomic, strong) NSString *complianceEventId;

//
// An array containing strings representing reasons for being out of compliance. This is nil when the
// compliance state is MaaS360SDKComplianceStateUnknown or MaaS360SDKComplianceStateInCompliance.
//
@property (nonatomic, strong) NSArray* outOfComplianceReasons;

@end
