//
//  FLCOAlertViewDelegate.h
//  commons
//
//  Created by Mayur Kothawade on 12/21/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FLCOAlertViewContext.h"

@class FLCOAlertViewContext;

@protocol FLCOAlertViewDelegate <NSObject>

@required
- (void)alertViewContext:(FLCOAlertViewContext*)context forAlertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex;

@optional

- (BOOL)alertViewShouldEnableFirstOtherButtonForContext:(FLCOAlertViewContext*)context   forAlertView:(UIAlertView *)alertView;

@end
