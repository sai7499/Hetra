//
//  FLM360ProgressHUDModified.h
//  core
//
//  Created by Sachin on 28/06/13.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreGraphics/CoreGraphics.h>
#import "FLM360ProgressHUD.h"


@interface FLM360ProgressHUDModified : FLM360ProgressHUD
+ (FLM360ProgressHUDModified *)showHUDAddedTo:(UIView *)view animated:(BOOL)animated;

@end
