//
//  FLCOIntroductionViewController.h
//  FLUICommons
//
//  Created by Vivek Murali on 10/30/14.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol FLCOIntroductionViewControllerDelegate <NSObject>

- (NSDictionary *)getFramesToShowInIntroductionViewWithContext:(NSDictionary*)contextData;
- (void) introductionTourViewController:(id)controller skipped:(BOOL)skipped;

@end

@interface FLCOIntroductionViewController : UIViewController

@property (weak, nonatomic) id <FLCOIntroductionViewControllerDelegate> delegate;
@property (nonatomic, strong) NSDictionary *contextData;

@end
