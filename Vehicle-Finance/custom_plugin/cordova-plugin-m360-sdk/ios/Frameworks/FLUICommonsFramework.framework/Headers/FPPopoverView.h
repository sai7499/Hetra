//
//  FPPopoverView.h
//
//  Created by Alvise Susmel on 1/4/12.
//  Copyright (c) 2012 Fifty Pixels Ltd. All rights reserved.
//
//  https://github.com/50pixels/FPPopover


#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>

typedef enum FPPopoverArrowDirection: NSUInteger {
    FPPopoverArrowDirectionUp = 1UL << 0,
    FPPopoverArrowDirectionDown = 1UL << 1,
    FPPopoverArrowDirectionLeft = 1UL << 2,
    FPPopoverArrowDirectionRight = 1UL << 3,
    FPPopoverNoArrow = 1UL << 4,
    
    FPPopoverArrowDirectionVertical = FPPopoverArrowDirectionUp | FPPopoverArrowDirectionDown | FPPopoverNoArrow,
    FPPopoverArrowDirectionHorizontal = FPPopoverArrowDirectionLeft | FPPopoverArrowDirectionRight,
    
    FPPopoverArrowDirectionAny = FPPopoverArrowDirectionUp | FPPopoverArrowDirectionDown | 
    FPPopoverArrowDirectionLeft | FPPopoverArrowDirectionRight
    
} FPPopoverArrowDirection;

#ifndef FPPopoverArrowDirectionIsVertical
    #define FPPopoverArrowDirectionIsVertical(direction)    ((direction) == FPPopoverArrowDirectionVertical || (direction) == FPPopoverArrowDirectionUp || (direction) == FPPopoverArrowDirectionDown || (direction) == FPPopoverNoArrow)
#endif

#ifndef FPPopoverArrowDirectionIsHorizontal
#define FPPopoverArrowDirectionIsHorizontal(direction)    ((direction) == FPPopoverArrowDirectionHorizontal || (direction) == FPPopoverArrowDirectionLeft || (direction) == FPPopoverArrowDirectionRight)
#endif

typedef enum {
    FPPopoverWhiteTint=0,
    FPPopoverBlackTint=1,
    FPPopoverLightGrayTint=2,
    FPPopoverGreenTint=3,
    FPPopoverRedTint=4,
    FPPopoverBrowserPurpleTint=5,
    FPPopoverDefaultTint = FPPopoverBlackTint
} FPPopoverTint;

@interface FPPopoverView : UIView

@property(nonatomic,strong) NSString *title;
@property(nonatomic,assign) CGPoint relativeOrigin;
@property(nonatomic,assign) FPPopoverTint tint;
@property(nonatomic,assign) BOOL draw3dBorder;
@property(nonatomic,assign) BOOL border; //default YES

@property(nonatomic) BOOL needsPlainWhite;

-(void)setArrowDirection:(FPPopoverArrowDirection)arrowDirection;
-(FPPopoverArrowDirection)arrowDirection;

-(void)addContentView:(UIView*)contentView;

@end
