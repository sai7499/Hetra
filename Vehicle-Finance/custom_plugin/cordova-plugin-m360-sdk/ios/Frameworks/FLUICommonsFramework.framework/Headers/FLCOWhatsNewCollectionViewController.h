//
//  FLCOWhatsNewCollectionViewController.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 09/04/15.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOWhatsNewCollectionViewCellWithActions.h"


@protocol FLCOWhatsNewControllerDelegate <NSObject>

-(void)whatsNewController:(UIViewController*)controller finishedTour:(BOOL)finished;
-(void)whatsNewController:(UIViewController*)controller tapOnEnableNowButton:(id)sender;
-(void)whatsNewController:(UIViewController*)controller tapOnLaterButton:(id)sender;


@end


@interface FLCOWhatsNewCollectionViewController : UICollectionViewController <UICollectionViewDataSource, UICollectionViewDelegate,FLCOWhatsNewCollectionViewCellWithActionsDelegate>

@property (nonatomic, weak) id<FLCOWhatsNewControllerDelegate> whatsNewDelegate;
@property (nonatomic, copy) NSDictionary *features;
@property (nonatomic, strong) UIView *backgroundView;
@property (nonatomic, copy) NSString *dismissButtonTitle;
@property (nonatomic, copy) NSString *viewTitle;
@property (nonatomic) BOOL hideOtherButtons;
@property (nonatomic) BOOL hideBackGroundColor;


@property (nonatomic, readonly) UIEdgeInsets contentInset;

- (instancetype)initWithNewFeatures:(NSDictionary *)features;

@end
