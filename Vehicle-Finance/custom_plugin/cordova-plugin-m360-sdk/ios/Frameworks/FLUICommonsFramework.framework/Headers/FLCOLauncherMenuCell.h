//
//  FLCOLauncherMenuCell.h
//  SpringBoard
//
//  Created by Mudireddy Suresh on 08/07/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOLauncherMenuCell : UICollectionViewCell

@property (nonatomic, strong) UIButton      *addButton;
@property (nonatomic, assign) NSUInteger    badgeValue;
@property (nonatomic, strong) UIColor       *badgeFillColor;
@property (nonatomic, strong) UIColor       *backgroundColor;
@property (nonatomic, strong) UIImage       *menuItemImage;
@property (nonatomic, strong) NSString      *menuItemTitle;
@property (nonatomic, strong) NSString      *shortcutUrl;
@property (nonatomic , assign)Boolean       isSelected;
@property (nonatomic, assign) BOOL          editing;
@property (nonatomic, assign) Boolean       isLightColorBackground;
@property (nonatomic, strong) NSString      *accessHintMessage;

- (void)startQuivering;
- (void)stopQuivering;
@end
