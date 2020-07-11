//
//  FLCOPinEntryTextField.h
//  MaaS360
//
//  Created by Mudireddy Suresh on 12/04/13.
//  Copyright (c) 2013 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOPopUpToastView.h"

@interface FLCOPinEntryTextField : UITextField

@property (nonatomic,assign)  BOOL disableCopyPaste;
@property (nonatomic, weak) UIView *toastPresentInView;
@property (nonatomic, strong) UIColor *leftToastViewBGColor;
@property (nonatomic, strong) UIColor *rightToastViewBGColor;
@property (nonatomic, readonly) FLCOPopUpToastView *toastMessageView;

- (void)shake;

-(void)showLeftIcon:(UIImage*)icon forToastMsg:(NSString *)msg;
-(void)showRightIcon:(UIImage*)icon forToastMsg:(NSString *)msg;

@end
