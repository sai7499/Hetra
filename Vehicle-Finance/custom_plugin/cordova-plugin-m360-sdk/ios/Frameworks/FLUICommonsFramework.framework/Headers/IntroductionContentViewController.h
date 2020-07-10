//
//  IntroductionContentViewController.h
//  FLUICommons
//
//  Created by Naveen Yellapu on 5/8/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOAppFeatureDetails.h"

@interface IntroductionContentViewController : UIViewController

@property NSUInteger pageIndex;
@property (nonatomic, strong) FLCOAppFeatureDetails *appFeatureDetail;


@end
