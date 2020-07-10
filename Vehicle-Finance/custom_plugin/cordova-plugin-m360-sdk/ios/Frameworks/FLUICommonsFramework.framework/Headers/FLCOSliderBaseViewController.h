//
//  FLCOSliderBaseViewController.h
//  FLUICommons
//
//  Created by test on 4/4/16.
//  Copyright (c) 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOUIConstants.h"

@interface FLCOSliderBaseViewController : UIViewController

@property (nonatomic, assign) FolderPickerMode mode;

-(void)disableScrollForView:(UIScrollView *)scrollView;
@end

