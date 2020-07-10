//
//  FLCOActionView.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 29/08/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOUIAction.h"

@interface FLCOActionView : UIView

@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *message;
@property (nonatomic, readonly) NSArray *actions;
@property (nonatomic, strong) UIView *contentView;
@property (assign, nonatomic) BOOL disableBlurEffects;
@property (assign, nonatomic) BOOL disableBlurEffectsForContentView;

+ (instancetype)actionViewWithTitle:(NSString *)aTitle message:(NSString *)aMessage;

- (void)addAction:(FLCOUIAction *)action;
- (FLCOUIAction*)actionByTag:(NSUInteger)tag;

@end
