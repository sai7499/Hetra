//
//  FLCOAlertViewManager.h
//  commons
//
//  Created by Mayur Kothawade on 12/20/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "FLCOAlertViewContext.h"

@interface FLCOAlertViewManager : NSObject
{
    BOOL alertViewLock;
}
@property (nonatomic,retain) UIAlertView *customAlertView;
@property (nonatomic,retain) NSMutableDictionary *alertViewMap;
@property (nonatomic, strong) NSOperationQueue *alertViewQueue;


+ (FLCOAlertViewManager *)sharedInstance;
-(void)enqueueAlertViewWithContext:(FLCOAlertViewContext *)context;
-(void)suspendAlertViewQueue;
-(void)resumeAlertViewQueue;
-(void)emptyAlertViewQueue;

-(void)suspendCurrentOperation;
-(void)cancelAllAlertsWithId:(NSString*)alertViewId withCompletionBlock:(void (^)(void))completionBlock;


@end
