//
//  FLCOCircleView.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 24/11/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOCircleView : UIView

@property (nonatomic, assign) BOOL filled;
@property (nonatomic, assign) CGFloat diameter;

- (instancetype)initCircleViewWithRadius:(CGFloat)radius;
- (instancetype)initCircleViewWithRadius:(CGFloat)radius withBorder:(BOOL)shouldUserBorder;
@end
