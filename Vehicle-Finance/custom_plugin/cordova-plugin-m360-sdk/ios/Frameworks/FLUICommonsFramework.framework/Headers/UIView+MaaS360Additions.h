//
//  UIView+MaaS360Additions.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 03/02/15.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIView (MaaS360Additions)

//UIView Animation additions
- (void)zoomInWithCompletionBlock:(void (^)(BOOL finished))completion;
- (void)zoomOutWithCompletionBlock:(void (^)(BOOL finished))completion;
- (void)fadeZoomOutWithCompletionBlock:(void (^)(BOOL finished))completion;
- (void)fadeZoomInWithCompletionBlock:(void (^)(BOOL finished))completion;

- (void)fadeInWithCompletionBlock:(void (^)(BOOL finished))completion;
- (void)fadeOutAndRemoveFromSuperviewWithCompletionBlock:(void (^)(BOOL finished))completion;
- (void)fadeOutWithCompletionBlock:(void (^)(BOOL finished))completion;

//UIView lefe cycle additions
- (void)hide;
- (void)show;
- (NSArray *)superviews;
- (id)firstSuperviewOfClass:(Class)superviewClass;

//UIview representaion additions
- (UIImage *)imageRepresentation;

//Drawing shapes on UIView.
-(void)addInvertedRightAngleTraingleOnTopRightCornerOfWidth:(CGFloat)width withTag:(NSUInteger)tag;

-(void)applyTableViewHeaderThemem;
-(void)applyNormalViewHeaderThemem;

+ (UIView *)seperatorView;

@end
