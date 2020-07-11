//
//  Animator.h
//  NavigationTransitionTest
//
//  Created by Chris Eidhof on 9/27/13.
//  Copyright (c) 2013 Chris Eidhof. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol CustomAnimationProtocol
-(CGPoint)getTouchPoint;
@end

@interface Animator : NSObject <UIViewControllerAnimatedTransitioning>

@property (nonatomic, assign) float animationDuration;

@end
