//
//  CustomSplitViewController.h
//  MaaS360
//
//  Created by Naresh SVS on 07/10/12.
//  Copyright (c) 2012 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface CustomSplitViewController : UISplitViewController 
{
    UIPopoverController* __unsafe_unretained _popOverController;
    UIBarButtonItem * __unsafe_unretained _popOverBarButton;
}

@property(nonatomic, readonly) UIPopoverController* popOverController;
@property(nonatomic, readonly) UIBarButtonItem    *popOverBarButton;
@property(nonatomic, assign) BOOL  isBlockingMode;
//Functions to customize the split view controller display  in container
- (void)setPopOverController:(UIPopoverController *)popOverController barButton:(UIBarButtonItem *)button;

- (void)showOrHidePortaitModePopoverView;

@end
