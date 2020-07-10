//
//  FLCOInfiniteCollectionPagingView.h
//  FLUICommons
//
//  Created by Vivek Murali on 12/22/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCOInfiniteCollectionPagingView;



/**
 FLCOInfiniteCollectionPagingViewDataSource protocol
 */
@protocol FLCOInfiniteCollectionPagingViewDataSource <NSObject>

@required

/**
 Asks the datasource for the UIView that is to be shown for the given page
 */
- (UIView *)infiniteCollectionPagingView:(FLCOInfiniteCollectionPagingView *)infiniteCollectionPagingView viewForPage:(NSInteger)page;

@end



/**
 FLCOInfiniteCollectionPagingViewDelegate protocol
 */
@protocol FLCOInfiniteCollectionPagingViewDelegate <NSObject>

@required

/**
 Asks the delegate if a size transition is of the container view controller in progress. The size transition is usually an orientation change.
 */
- (BOOL)isSizeTransitionInProgressForInfiniteCollectionPagingView:(FLCOInfiniteCollectionPagingView *)infiniteCollectionPagingView;

@optional

/**
 Notifies the delegate that the collection view scrolled to a particular page.
 */
- (void)infiniteCollectionPagingView:(FLCOInfiniteCollectionPagingView *)infiniteCollectionPagingView didScrollToPage:(NSInteger)page;

@end



@interface FLCOInfiniteCollectionPagingView : UIView

- (instancetype)initWithFrame:(CGRect)frame collectionViewScrollDirection:(UICollectionViewScrollDirection)collectionViewScrollDirection;

@property (weak, nonatomic) id <FLCOInfiniteCollectionPagingViewDataSource> datasource;
@property (weak, nonatomic) id <FLCOInfiniteCollectionPagingViewDelegate> delegate;

/**
 Get the view for the given page. Returns nil if no such view is present
 */
- (UIView *)viewForPage:(NSInteger)page;

/**
 Set paging enabled for the collection view. Default is YES
 */
- (void)setPagingEnabled:(BOOL)pagingEnabled;

/**
 Set the sub page width of the collection view. This is used to scroll the collection view so that it always come to rest at the beginning of a subpage.
 This value is only valid when the collection view has pagingEnabled set to NO.
 */
- (void)setSubPageWidth:(CGFloat)subPageWidth;

/**
 Set the initial page for the collection view. Default is 0. This should be typically called only once during initial setup.
 Scrolling updates the currentPage. Scrolling to the left/up decrements the page and scrolling to right/down increments the page.
 */
- (void)setInitialPage:(NSInteger)initialPage;

/**
 Set current page for the collection view.
 */
- (void)setCurrentPage:(NSInteger)currentPage animated:(BOOL)animated;

@end
