//
//  UIImage+Progress.h
//  ImageProgress
//
//  Created by Naveen Murthy on 1/19/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "M13ProgressViewPie.h"

#import <UIKit/UIKit.h>


@interface UIImageView (Progress)

- (void) showProgress;
    
- (void) hideProgress;

- (void)setProgress:(CGFloat)progress animated:(BOOL)animated;
    


@end


