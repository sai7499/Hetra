//
//  FLCOQuickSwitchView.h
//  FLUICommons
//
//  Created by Bhargav  on 3/26/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "QuickSwitchProtocol.h"

@interface FLCOQuickSwitchView : UIControl

@property (weak) id <QuickSwitchSelectionProtocol> delegate;
@property (nonatomic, strong) UIView *container;
@property NSUInteger numberOfSections;
@property CGAffineTransform startTransform;

- (id) initWithFrame:(CGRect)frame withIcons:(NSMutableArray*)icons;

@end
