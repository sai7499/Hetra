//
//  FLCOGridViewLayout.h
//  GridLayout
//
//  Created by Mudireddy Suresh on 08/07/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOGridViewLayoutAttributes.h"

@protocol FLCOGridViewLayoutDataSource <UICollectionViewDataSource>

@optional

- (NSIndexPath *)collectionView:(UICollectionView *)collectionView indexPathToMoveToItemAtIndexPath:(NSIndexPath *)fromIndexPath;

- (void)collectionView:(UICollectionView *)collectionView itemAtIndexPath:(NSIndexPath *)fromIndexPath willMoveToIndexPath:(NSIndexPath *)toIndexPath;

- (void)collectionView:(UICollectionView *)collectionView itemAtIndexPath:(NSIndexPath *)fromIndexPath didMoveToIndexPath:(NSIndexPath *)toIndexPath;

- (BOOL)collectionView:(UICollectionView *)collectionView canMoveItemAtIndexPath:(NSIndexPath *)indexPath;

- (BOOL)collectionView:(UICollectionView *)collectionView itemAtIndexPath:(NSIndexPath *)fromIndexPath canMoveToIndexPath:(NSIndexPath *)toIndexPath;

@end



@protocol FLCOGridViewLayoutDelegate

@required

- (BOOL)isActionModeActiveForCollectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout;

- (NSUInteger) currentPageIndexForCollectionView:(UICollectionView *)collectionView;

//- (void) onLongPress;
//- (void) onLongPressCancelled;

@end

@protocol FLCOGridViewInteractionDelegate
@required

//- (BOOL)isActionModeActiveForCollectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout;
//- (NSUInteger) currentPageIndexForCollectionView:(UICollectionView *)collectionView;
- (void) onLongPress;
//- (void) onLongPressCancelled;

@end

@interface FLCOGridViewLayout : UICollectionViewFlowLayout <UIGestureRecognizerDelegate>
{
    NSUInteger _numberOfPages;
}

@property (nonatomic, readonly) NSUInteger numberOfPages;
@property (nonatomic) NSUInteger maxNumberOfColumns;
@property (nonatomic) NSUInteger maxNumberOfRows;

//To support Move.
@property (assign, nonatomic) CGFloat scrollingSpeed;
@property (assign, nonatomic) UIEdgeInsets scrollingTriggerEdgeInsets;
@property (strong, nonatomic, readonly) UILongPressGestureRecognizer *longPressGestureRecognizer;
//@property (strong, nonatomic, readonly) UIPanGestureRecognizer *panGestureRecognizer;

-(void) willRotateToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation;
-(void) didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation;
-(CGFloat) getRequiredMinimumColumnSpace;
-(CGFloat) getRequiredMinimumRowSpace;


@end
