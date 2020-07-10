//
//  UIBarButtonItem+CustomButton.h
//  FLUICommons
//
//  Created by Satya Prakash on 3/18/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIBarButtonItem (CustomButton)

+ (UIBarButtonItem*) getBarButtonWithTitle:(NSString*)title forTarget:(id)target andSelector:(SEL)sel withAlignment:(UIControlContentHorizontalAlignment) alignment;
- (void)setTitleWithSizetoFit:(NSString*)title;

@end
