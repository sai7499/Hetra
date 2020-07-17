//
//  PullToRefresh.h
//  MaaS360
//
//  Created by kramgopal on 09/08/12.
//  Copyright 2012 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>

typedef enum {
    PullToRefreshViewStateNormal = 0,
	PullToRefreshViewStateReady,
	PullToRefreshViewStateLoading
} PullToRefreshViewState;

@protocol PullToRefreshViewDelegate;

@interface PullToRefreshView : UIView {
	PullToRefreshViewState state;
    
	UILabel *lastUpdatedLabel;
	UILabel *statusLabel;
	CALayer *arrowImage;
	UIActivityIndicatorView *activityView;
}

@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, weak) id <PullToRefreshViewDelegate> delegate;

- (void)refreshLastUpdatedDate;
- (void)finishedLoading;
- (void)setState:(PullToRefreshViewState)state_;
- (id)initWithScrollView:(UIScrollView *)scrollView;

@end

@protocol PullToRefreshViewDelegate <NSObject>

@optional
- (void)pullToRefreshViewShouldRefresh:(PullToRefreshView *)view;
- (NSDate *)pullToRefreshViewLastUpdated:(PullToRefreshView *)view;
@end
