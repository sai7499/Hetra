//
//  UIButton+VerticalLayout.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 18/04/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIButton (VerticalLayout)

- (void)centerVerticallyWithPadding:(float)padding;
- (void)centerVertically;

-(void) centerButtonAndImageWithSpacing:(CGFloat)spacing;

// Horizontal Layout with image on right side of text label
- (void)horizontalAlignedWithImageOnRightSide:(float)padding;

-(void)applySliderButtonTheme;

-(void)applyNormalButtonTheme;

// increase the button hit area.
@property(nonatomic, assign) UIEdgeInsets hitTestEdgeInsets;


@end
