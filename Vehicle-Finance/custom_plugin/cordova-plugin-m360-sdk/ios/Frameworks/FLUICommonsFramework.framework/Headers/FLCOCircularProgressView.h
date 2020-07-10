//
//  FLCOCircularProgressView.h
//  FLUICommons
//
//  Created by Vipin Thazhe Madam on 8/14/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOCircularProgressView : UIView

@property (nonatomic, assign) CGFloat progressValue;
@property (nonatomic, assign) BOOL    isDefiniteProgress;
-(void)setProgressColor:(UIColor*)color;

@end
