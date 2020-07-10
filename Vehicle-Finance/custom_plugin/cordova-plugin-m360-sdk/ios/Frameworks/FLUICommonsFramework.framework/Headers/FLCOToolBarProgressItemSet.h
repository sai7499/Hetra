//
//  FLCOToolBarProgressItemSet.h
//  FLCODragMenu
//
//  Created by Suresh Mudireddy on 18/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOToolBarItemSet.h"

@interface FLCOToolBarProgressItemSet : FLCOToolBarItemSet

@property (nonatomic, strong, readonly) UILabel *titleLabel;
@property (nonatomic, strong, readonly) UIProgressView *progressView;

+ (FLCOToolBarProgressItemSet *)progressBarItemSetWithTitle:(NSString *)title;
+ (FLCOToolBarProgressItemSet *)progressBarItemSetWithTitle:(NSString *)title dismissTarget:(id)target andAction:(SEL)action;

- (float)progress;
- (void)setProgress:(float)progress animated:(BOOL)animated;

@end
