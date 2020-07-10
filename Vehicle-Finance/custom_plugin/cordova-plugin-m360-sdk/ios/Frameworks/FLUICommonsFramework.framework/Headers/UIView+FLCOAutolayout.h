//
//  UIView+FLCOAutolayout.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 24/11/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (FLCOAutolayout)

+(id)autolayoutView;

- (void) testAmbiguity;

- (NSArray *) allViewConstraints;

- (void) excersiseAmigiousLayoutsByAxis;

-(void)LogAllSubviewsIntrinsicSize;

@end
