//
//  FLCOCollectionViewControllerEx.h
//  SpringBoard
//
//  Created by Mudireddy Suresh on 09/07/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOLauncherMenuCell.h"
#import "FLCOGridViewLayout.h"
#import "FLCOGridViewLayoutAttributes.h"

@interface FLCOCollectionViewControllerEx : UIViewController <UICollectionViewDelegate, UICollectionViewDataSource, UIScrollViewDelegate, UIGestureRecognizerDelegate >
{
    NSMutableDictionary *_collectionViewdata;
}

@property (nonatomic, weak) IBOutlet UIPageControl *pageControl;
@property (nonatomic, weak) IBOutlet UICollectionView *gridView;
@property (nonatomic, weak) IBOutlet UIImageView *logoView;
@property (nonatomic, weak) IBOutlet UIImageView *bgImageView;
@property (nonatomic, strong) IBOutlet NSMutableDictionary *collectionViewdata;

- (IBAction)pageChanged:(id)sender;

@end
