//
//  FLCOCollectionView.h
//  FLUICommons
//
//  Created by Mudireddy Suresh on 15/07/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOCollectionView : UIView
{
    __weak IBOutlet UICollectionView *_collectionView;
    __weak IBOutlet UIPageControl    *_pageCtrlView;
}

@property (nonatomic, weak) IBOutlet UICollectionView *collectionView;
@property (nonatomic, weak) IBOutlet UIPageControl *pageCtrlView;

- (IBAction)pageChanged:(id)sender;

+ (id)collectionGridViewWithBundle: (NSBundle *)bundle;

@end
