//
//  FLCOScrollMenuBar.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 30/01/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOBarMenuItem.h"

@class FLCOScrollMenuBar;

@protocol FLCOScrollMenuBarDelegate <NSObject>
@optional
- (void)scrollMenu:(FLCOScrollMenuBar *)menu didSelectIndex:(NSInteger)selectedIndex;
@end


typedef NS_ENUM(NSInteger, FLCOScrollMenuItemSelectAnimation)
{
    FLCOFadeZoomIn,
    FLCOFadeZoomOut,
    FLCOShake,
    FLCOClassicAnimation,
    FLCOZoomOut
};

@interface FLCOScrollMenuBar : UIView <UIScrollViewDelegate>

@property (nonatomic, strong) NSArray *menuItems;
@property (nonatomic, readonly) UIScrollView *scrollView;
@property (nonatomic, assign) FLCOScrollMenuItemSelectAnimation selectionAnimationType;
@property (nonatomic, assign) NSUInteger selectedItemIndex;
@property (nonatomic, weak) id <FLCOScrollMenuBarDelegate> delegate;

- (id)initScrollMenuWithFrame:(CGRect)frame menuItems:(NSArray *)menuItems;
- (id)initScrollMenuWithItems:(NSArray *)menuItems;

@end
