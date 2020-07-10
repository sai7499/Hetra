//
//  FLCOLinearProgressView.h
//  FLUICommons
//
//  Created by Swaroop Mahajan on 07/09/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOLinearProgressView : UIView

/**The radius of the corner if the corner type is set to rounded rect.*/
@property (nonatomic, assign) CGFloat cornerRadius;
/**The width of the stripes if shown.*/
@property (nonatomic, assign) CGFloat stripeWidth;
/**Wether or not the stripes are animated.*/
@property (nonatomic, assign) BOOL animateStripes;
/**Wether or not to show the stripes.*/
@property (nonatomic, assign) BOOL showStripes;
/**The color of the stripes.*/
@property (nonatomic, retain) UIColor *stripeColor;
/**The width of the border.*/
@property (nonatomic, assign) CGFloat borderWidth;
/**Wether or not the progress view is indeterminate.*/
@property (nonatomic, assign) BOOL indeterminate;
/**Allow us to write to the progress.*/
@property (nonatomic, readwrite) CGFloat progress;

- (void)setProgress:(CGFloat)progress animated:(BOOL)animated;
- (void)setPrimaryColor:(UIColor *)primaryColor;

@end
