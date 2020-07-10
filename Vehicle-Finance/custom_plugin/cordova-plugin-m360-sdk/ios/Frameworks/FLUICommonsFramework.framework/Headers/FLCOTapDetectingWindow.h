//
//  FLCOTapDetectingWindow.h
//  FLUICommons
//
//  Created by Sachin on 27/05/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol FLCOTapDetectingWindowDelegate

- (void)userDidTapView;

@end

@interface FLCOTapDetectingWindow : UIWindow

@property (nonatomic, strong) UIView *viewToObserve;
@property (nonatomic, weak) id <FLCOTapDetectingWindowDelegate> controllerThatObserves;

@end

