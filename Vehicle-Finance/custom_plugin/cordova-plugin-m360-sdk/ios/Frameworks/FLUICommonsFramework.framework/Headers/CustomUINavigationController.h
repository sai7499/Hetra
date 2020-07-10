//
//  CustomUINavigationController.h
//  MaaS360
//
//  Created by Mudireddy Suresh on 04/10/12.
//  Copyright (c) 2012 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOBaseNavigationController.h"

@interface CustomUINavigationController : FLCOBaseNavigationController

//Helper method to setup custom tool bar on UINavigation controller.
- (id)initWithRootViewController:(UIViewController *)rootViewController withCustomToolBar:(Class)customToolBar;
@property (nonatomic,assign)BOOL isBlockingMode;
@end
