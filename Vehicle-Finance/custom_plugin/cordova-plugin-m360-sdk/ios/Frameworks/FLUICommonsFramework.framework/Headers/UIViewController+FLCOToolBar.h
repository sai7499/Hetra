//
//  UIViewController+FLCOToolBar.h
//  FLCODragMenu
//
//  Created by Suresh Mudireddy on 18/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOToolBarItemSet.h"
#import "FLCOTabBarView.h"
#import "FLCODragMenuListItem.h"
#import "FLCOScrollMenuBar.h"

@interface UIViewController (FLCOToolBar) <FLCOTabBarViewDelegate, UIToolbarDelegate>

@property (nonatomic, strong, readonly) NSArray *toolBarItemSets;
@property (nonatomic, weak, readonly) FLCOToolBarItemSet *visibleBarItemSet;

/*
 * Call this method in viewDidAppear: to update toolbar's appearance to the latest state
 */

- (void)reloadToolBarMenu;
- (void)updateToolbarToLatestStateAnimated:(BOOL)animated;

- (void)pushBarItemSet:(FLCOToolBarItemSet *)barItemSet animated:(BOOL)animated;
- (void)appendBarItemSet:(FLCOToolBarItemSet *)barItemSet;

- (void)removeBarItemSet:(FLCOToolBarItemSet *)barItemSet animated:(BOOL)animated;
- (void)removeAllBarItemSetsAnimated:(BOOL)animated;

- (void)closeToolBarMenuWithCompletion:(void (^)(BOOL finished))completion;
- (void)openToolBarMenuWithCompletion:(void (^)(BOOL finished))completion;
- (void)setToolBarGesturesEnabled:(BOOL)enabled;

/*  Progress View in ToolBar */

- (void)showProgress;
- (void)setIndeterminate:(BOOL)indeterminate;
- (void)finishProgress;
- (BOOL)isShowingProgressBar;

@end
