//
//  FLCOBaseUIViewController.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 23/11/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLM360ProgressHUD.h"

extern NSString *const kStandardKeys;
extern NSString *const kCustomKeys;
extern NSString *const kCustomKey;
extern NSString *const kModifierKey;

@interface FLCOBaseUIViewController : UIViewController

@property (nonatomic, strong) UIColor *backgroundColor; // Applicable only if translucentBackground == NO
@property (nonatomic, assign) BOOL translucentBackground;
@property (nonatomic, strong) UIImage *backgroundImage; //If translucent background is YES then blur effect applied otherwise the image to be set as background.
@property (nonatomic, assign) UIStatusBarStyle barStyle;

@property (nonatomic, strong) UIColor *actionButtonFillColor;
@property (nonatomic, strong) UIImage *actionButtonImage;

//Child controllers to provide the set of key commands the base controller starts listen from external keyborad
-(NSDictionary*)getKeyCommandsToListen;

//Child controllers to provide the set of key commands the base controller starts listen from external keyborad
- (void)handleShortcut:(UIKeyCommand *)keyCommand;

#pragma mark - Proress Management

//Progress HUD at the cenetr of the screen
-(void) showProgressViewWithMessage:(NSString*)message;
-(void) hideProgressView;
-(FLM360ProgressHUD*)progressView;

//Loading activity indicator at the cenetr of the screen
-(void) showLoadingIndicatorView;
-(void) hideLoadingIndicatorView;
-(UIActivityIndicatorView*)loadingIndicatorView;

-(void)userTextSizeDidChange:(NSNotification*)notification;

-(void)showHoverButtonWithImage:(UIImage*)image;
-(void)hideHoverButton;
-(BOOL)isHoverViewVisible;

@end
