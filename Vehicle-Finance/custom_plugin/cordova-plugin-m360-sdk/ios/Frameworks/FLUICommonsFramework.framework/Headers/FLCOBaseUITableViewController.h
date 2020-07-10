//
//  FLCOBaseUITableViewController.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 05/05/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLM360ProgressHUD.h"

/*
 Base class for UITableViewController to provide the following functionality

 1. ProgressView Management
 2. No Data/Items message display
 3. PullToRefresh Control Management
 4. BAckground Image with/without Blur
 
 */

@interface FLCOBaseUITableViewController : UITableViewController

#pragma mark - Proress Management
-(void) showProgressViewWithMessage:(NSString*)message;
-(void) hideProgressView;
-(FLM360ProgressHUD*)progressView;

//Loading activity indicator at the cenetr of the screen
-(void) showLoadingIndicatorView;
-(void) hideLoadingIndicatorView;
-(UIActivityIndicatorView*)loadingIndicatorView;

@end
