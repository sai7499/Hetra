//
//  FLCOCustomBadge.h
//  SpringBoard
//
//  Created by Mudireddy Suresh on 09/07/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
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
@interface FLCOCustomBadge : UIView
{
	
	NSString *_badgeText;
	UIColor *_badgeTextColor;
	UIColor *_badgeInsetColor;
	UIColor *_badgeFrameColor;
	BOOL _badgeFrame;
	BOOL _badgeShining;
    BOOL _badgeShadow;
	CGFloat _badgeCornerRoundness;
	CGFloat _badgeScaleFactor;
    CGFloat _badgeScaleWidthForSingleDigit;
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
+ (FLCOCustomBadge*) customBadgeWithString:(NSString *)badgeString;

- (void) updateBadgeText:(NSString *)badgeTextString;

@end
