//
//  FLUICustomNavTitleView.h
//  FLUICommons
//
//  Created by Apoorv on 9/23/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface FLUICustomNavTitleView : UIView

@property (nonatomic, readonly) UILabel *titleLabel;
@property (nonatomic, readonly) UILabel *subTitleLabel;


-(FLUICustomNavTitleView*)initWithFrame:(CGRect)frame;

@end
