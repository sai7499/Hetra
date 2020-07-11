//
//  FLCOBarMenuItem.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 30/01/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCOBarMenuItem;

@protocol FLCOBarMenuItemDelegate <NSObject>

- (void)itemTouchesBegan:(FLCOBarMenuItem *)item;
- (void)itemTouchesEnd:(FLCOBarMenuItem *)item;

@end

typedef void(^BarMenuItemActionHandler)(FLCOBarMenuItem *item);

typedef NS_ENUM(NSInteger, FLCOBarMenuItemType)
{
    FLCOBarMenuImageItem,
    FLCOBarMenuLabelItem,
    FLCOBarMenuImageAndLabeItem
};


@interface FLCOBarMenuItem : UIView

@property (weak, nonatomic) IBOutlet UIImageView *bgImageView;
@property (weak, nonatomic) IBOutlet UIImageView *itemIconView;
@property (weak, nonatomic) IBOutlet UILabel *titleLabel;

@property (nonatomic, copy) BarMenuItemActionHandler handler;
@property (assign, nonatomic) BOOL highlighted;
@property (weak, nonatomic) id<FLCOBarMenuItemDelegate> itemDelegate;
@property (nonatomic, strong) id itemID;

- (id)initBarMenuItem:(UIImage *)backgroundImage itemImage:(UIImage *)image andTitle:(NSString *)title;

- (id)initBarMenuItem:(UIImage *)backgroundImage itemImage:(UIImage *)image title:(NSString *)title andActionHandler:(BarMenuItemActionHandler)block;

- (void)setItemHighlightedBackground:(UIImage *)backgroundImageHightlighted iconHighlighted:(UIImage *)iconImageHighlighted textColorHighlighted:(UIColor *)texColorHighlighted;

@end
