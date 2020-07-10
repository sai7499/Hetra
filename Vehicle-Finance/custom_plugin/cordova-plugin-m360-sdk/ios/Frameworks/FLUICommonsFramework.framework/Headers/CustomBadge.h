//
//  CustomBadge.h
//  MaaS360
//
//  Created by Karthik Ramgopal on 06/03/13.
//  Copyright 2013 Fiberlink Communications Corp. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>

/*
 This class allows you to draw a typical iOS badge indicator with a custom text on any view.
 
 It is recommended to use the allocator customBadgeWithString to create a new badge.
 
 You can customize the following in addition to the badge text:
 -> The color inside the badge (badgeInsetColor),
 -> The color of the frame (badgeFrameColor)
 -> The color of the text (badgeTextColor)
 -> Whether to draw a frame around the badge or not.
 */
@interface CustomBadge : UIView {
	
	NSString *badgeText;
	UIColor *badgeTextColor;
	UIColor *badgeInsetColor;
	UIColor *badgeFrameColor;
	BOOL badgeFrame;
	BOOL badgeShining;
    BOOL badgeShadow;
	CGFloat badgeCornerRoundness;
	CGFloat badgeScaleFactor;
    CGFloat badgeScaleWidthForSingleDigit;
}

@property(nonatomic,retain) NSString *badgeText;
@property(nonatomic,retain) UIColor *badgeTextColor;
@property(nonatomic,retain) UIColor *badgeInsetColor;
@property(nonatomic,retain) UIColor *badgeFrameColor;

@property(nonatomic,readwrite) BOOL badgeFrame;
@property(nonatomic,readwrite) BOOL badgeShining;
@property(nonatomic,readwrite) BOOL badgeShadow;

@property(nonatomic,readwrite) CGFloat badgeCornerRoundness;
@property(nonatomic,readwrite) CGFloat badgeScaleFactor;
@property(nonatomic,readwrite) CGFloat badgeScaleWidthForSingleDigit;

- (id) initWithString:(NSString *)badgeString withScale:(CGFloat)scale withShining:(BOOL)shining withShadow:(BOOL)shadow withBadgeFrame:(BOOL)showBadgeFrame;
+ (CustomBadge*) customBadgeWithString:(NSString *)badgeString;

- (void) updateBadgeText:(NSString *)badgeTextString;

@end
