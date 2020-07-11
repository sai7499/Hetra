//
//  FLCOHorizontalContainerView.h
//  FLUICommons
//
//  Created by Vivek Murali on 1/13/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOHorizontalContainerView : UIView

@property (nonatomic, assign) CGFloat viewPadding;

- (instancetype)initWithFrame:(CGRect)frame views:(NSArray *)views viewWidth:(CGFloat)viewWidth;

@end
