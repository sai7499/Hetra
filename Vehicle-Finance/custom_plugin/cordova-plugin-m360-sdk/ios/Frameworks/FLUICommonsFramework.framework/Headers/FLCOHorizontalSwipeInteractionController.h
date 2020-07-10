//
//  FLCOHorizontalSwipeInteractionController.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 18/12/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOHorizontalSwipeInteractionController : UIPercentDrivenInteractiveTransition

- (void)transistionToViewController:(UIViewController *)viewController;

@property (nonatomic, assign) BOOL interactionInProgress;
@property (nonatomic, assign, getter = isEnabled) BOOL enabled;

@end
