//
//  UIBarButtonItem+CustomViewBadge.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 09/02/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIBarButtonItem (CustomViewBadge)

@property (strong, nonatomic) UILabel *badge;

// Badge value to be display
@property (nonatomic) NSString *badgeValue;

// Badge background color
@property (nonatomic) UIColor *badgeBGColor;

// Badge text color
@property (nonatomic) UIColor *badgeTextColor;

// Badge font
@property (nonatomic) UIFont *badgeFont;

// Padding value for the badge
@property (nonatomic) CGFloat badgePadding;

// Minimum size badge to small
@property (nonatomic) CGFloat badgeMinSize;

// Values for offseting the badge over the BarButtonItem you picked
@property (nonatomic) CGFloat badgeOriginX;

@property (nonatomic) CGFloat badgeOriginY;

@end
