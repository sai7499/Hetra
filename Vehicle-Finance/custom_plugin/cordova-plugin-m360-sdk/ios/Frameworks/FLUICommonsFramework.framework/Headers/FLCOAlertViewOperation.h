//
//  FLCOAlertViewOperation.h
//  commons
//
//  Created by Mayur Kothawade on 12/21/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FLCOAlertViewContext.h"
#import <UIKit/UIKit.h>

@interface FLCOAlertViewOperation : NSOperation
{
    BOOL _alertDelegateCalled;
}
@property (nonatomic,retain) id alertView;
@property (nonatomic,retain) FLCOAlertViewContext *alertViewContext;

-(void)cancelOperation;
-(void)cancelOperationWithCompletionBlock:(void(^)(void))completionBlock;
-(void)cancelOperationWithoutCallingAlertCompletionBlock;
@end
