//
//  M360SDKConfig.h
//  MaaS360SDK
//
//  Created by Sachin on 11/06/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "M360SDKConstants.h"


@interface M360SDKConfig : NSObject

@property (nonatomic,strong) NSString *licenseKey,*developerID;
@property (nonatomic) MaaS360SDKLogLevel logLevel;
@property (nonatomic,assign) BOOL isAnalyticsV2Enabled;
@property (nonatomic,assign) BOOL isWrappedApp;

@end
