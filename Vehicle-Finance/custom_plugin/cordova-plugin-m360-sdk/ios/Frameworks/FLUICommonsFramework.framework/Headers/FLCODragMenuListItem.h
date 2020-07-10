//
//  FLCODragMenuListItem.h
//  FLCOToolbarSliderMenu
//
//  Created by Suresh Mudireddy on 06/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class FLCODragMenuListItem;

typedef void(^MenuItemActionHandler)(FLCODragMenuListItem *menuItem);

@interface FLCODragMenuListItem : NSObject

@property (nonatomic, strong) UIImage *itemImage;
@property (nonatomic, copy)   NSString *title;
@property (nonatomic, copy)   MenuItemActionHandler actionHandler;
@property (nonatomic, assign) NSUInteger actionItemID;
@property (nonatomic, assign) BOOL actionItemEnabled;
@property (nonatomic, assign) NSTextAlignment titleAlignment;

+ (instancetype)actionWithTitle:(NSString *)title image:(UIImage *)image handler:(MenuItemActionHandler)handler;

@end
