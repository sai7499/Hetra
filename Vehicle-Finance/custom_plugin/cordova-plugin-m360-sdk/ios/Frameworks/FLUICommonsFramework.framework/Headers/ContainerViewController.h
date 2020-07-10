//
//  ContainerViewController.h
//  EmbeddedSwapping
//
//  Created by Michael Luton on 11/13/12.
//  Copyright (c) 2012 Sandmoose Software. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCOBaseNavigationController;

@interface ContainerViewController : UIViewController

/**
 *  Init method to create the view controller .
 *
 *  @param backViewController backViewController is view to be show on back of the navigation controller
 *  @param frontViewController frontViewController is view controller to be show at front
 *
 *  @return Container View Controller with slider implemented by default.
 */
- (instancetype)initwithBackViewController:(UIViewController *)backViewController andFrontViewController:(UIViewController *)frontViewController;


- (instancetype)initwithBackViewNavigationController:(FLCOBaseNavigationController *)backViewController andFrontViewController:(FLCOBaseNavigationController *)frontViewController;

- (UINavigationController *)getTopNavigationController;

- (UINavigationController *)getBackNavigationController;

- (void)hideBackViewController;

@end
