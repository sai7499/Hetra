//
//  FLCOListViewItem.h
//  FLCOListViewItem
//
//  Created by Suresh Mudireddy on 06/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef enum : NSUInteger {
    FLCOListViewItemAcessoryStyleNone,
    FLCOListViewItemAcessoryStyleTick,
    FLCOListViewItemAcessoryStyleActivtyIndicator,
} FLCOListViewItemAcessoryStyle;

@class FLCOListViewItem;

typedef void(^MenuItemActionHandler)(FLCOListViewItem *menuItem);

@interface FLCOListViewItem : NSObject

@property (nonatomic, strong) UIImage *itemImage;
@property (nonatomic, copy)   NSString *title;
@property (nonatomic, copy)   MenuItemActionHandler actionHandler;
@property (nonatomic, assign) NSUInteger actionItemID;
@property (nonatomic, assign) BOOL actionItemEnabled;
@property (nonatomic, assign) NSTextAlignment titleAlignment;
@property (nonatomic, assign) FLCOListViewItemAcessoryStyle statusIndicator;

+ (instancetype)actionWithTitle:(NSString *)title image:(UIImage *)image handler:(MenuItemActionHandler)handler;

@end
