//
//  FLCORTEToolbar.h
//  FLUICommons
//
//  Created by Mayur Kothawade on 7/17/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FPPopoverController.h"


//@protocol FLCORTEToolbarDelegate <NSObject>
//
//@optional
//
//- (void) tappedOnRTEToolbarAttachmentButton:(id)sender;
//
//@end



@interface FLCORTEToolbar : UIToolbar<FPPopoverControllerDelegate>

@property (nonatomic,weak) UIViewController *delegateViewController;
@property (nonatomic,assign) CGRect relativeFrame;
//@property (nonatomic, weak) id<FLCORTEToolbarDelegate> toolBarDelegate;

-(id)initWithWebView:(UIWebView*)webView andFrame:(CGRect)frame;

/*
 Discription :
 
 Call this method in UIWebView delegate :
 -(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;
 
 Obtain keyCode by following method :
 NSString *keyCodeStr = [[url absoluteString] substringFromIndex:[@"mpscontentedited://" length]];
 NSUInteger keyCode = [keyCodeStr integerValue];
 */
-(void)evaluateToolBarWithKeyCode:(NSUInteger)keyCode;
-(void)addCustomBarButtons:(NSArray*)buttons;
-(void)hideDefaultButtons;
-(void)showDefaultButtons;
-(void)updateFormatToolBar;
-(void)keyboardDownButtonClicked;
-(void)doCleanUp;
-(void)updateAllFormatButtons;
-(void)updateFormatButtonsWithState:(NSString*)stateItems;


- (void)popoverControllerDidDismissPopover:(FPPopoverController *)popoverController;

@end
