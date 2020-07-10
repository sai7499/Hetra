//
//  FLUIPasswordPromptView.h
//  MaaS360
//
//  Created by Selvam on 28/08/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>


@class FLUIPasswordPromptView;

@protocol FLUIPasswordPromptViewDelegate

- (void)didEnterPassword:(NSString*)password inView:(FLUIPasswordPromptView*)view;

 @optional
- (void)didEditedPassword:(NSString *)password inView:(FLUIPasswordPromptView*)view;
- (void)didDismissPasswordPromptView:(FLUIPasswordPromptView*)view;

@end

@interface FLUIPasswordPromptView : UIView

@property (nonatomic, weak) IBOutlet UITextField *passwordField;
@property (nonatomic, weak) IBOutlet UIButton *closeButton;
@property (nonatomic, weak) IBOutlet UILabel *promptLabel;
@property (nonatomic, strong) id context;

+ (instancetype)viewWithFrame:(CGRect)frame delegate:(id <FLUIPasswordPromptViewDelegate>)delegate;
- (IBAction)dismissPromptView;

- (void)showAlertWithMessage:(NSString *)message;

@end
