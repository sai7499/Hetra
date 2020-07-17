//
//  FLCOInfiniteScrollView.h
//  MaaS360
//
//  Created by Karthik Ramgopal on 29/03/13.
//  Copyright 2013 Fiberlink Communications Corp. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCOInfinitePagingView;

/**
 * Scrollable view protocol.
 */
@protocol ScrollableView <NSObject>

- (void)reloadContentData;

- (CGPoint)contentOffset;
- (void)setContentOffset:(CGPoint)contentOffset;
- (void)setContentOffset:(CGPoint)contentOffset preventOverflow:(BOOL)preventOverflow;

- (void)resetScrollViewContentSize;

@end

/**
 * Protocol to be implemented by the data source to return view for a given page.
 *
 * The first page which this view displays is marked as page number 0. Scrolling leftwards
 * causes negative page numbers to be requested and scrolling right, positive page numbers.
 */
@protocol FLCOInfinitePagingViewDataSource <NSObject>

- (UIView*) pagingView:(FLCOInfinitePagingView*)view viewForPage:(NSInteger)page offline:(BOOL)offline;

@end

/**
 * Delegate protocol to listen to page number changes.
 */
@protocol FLCOInfinitePagingViewDelegate <NSObject>

- (void) pagingView:(FLCOInfinitePagingView *)view scrolledToPage:(NSInteger)page isUserInitiated:(BOOL)userInitiated;

@end

/**
 * Infinite paging view supporting infinite horizontal scrolling in both directions with lazy loading and 
 * efficient memory management.
 */
@interface FLCOInfinitePagingView : UIView

@property (nonatomic, weak) id<FLCOInfinitePagingViewDelegate> delegate;
@property (nonatomic, weak)  id<FLCOInfinitePagingViewDataSource> dataSource;

//
// Init
//
- (id)initWithFrame:(CGRect)frame dataSource:(id<FLCOInfinitePagingViewDataSource>) dataSource;

//
// Programatically scroll to a given page. Calling this method does not notify the delegate (if any)
// about the page change.
//
- (void) scrollToPage:(NSInteger)page;

//
// Get the current display page number.
//
- (NSInteger) getDisplayPageNumber;

//
// Non animated data reload.
//
- (void) reload;

- (void) reloadCurrentPage;

//
// Set scrollable view offsets
//
- (void) setScrollableViewOffset:(CGPoint)offset updateExistingViews:(BOOL)update;

//
// Instruct the content view to reload its data.
//
- (void) reloadContentData;

-(UIView*)getCurrentDisplayPageView;

-(void)resetDisplayPageNumber;

@end
