//
//  FLCOToolBarMenu.h
//  FLCOToolBarMenu
//
//  Created by Suresh Mudireddy on 06/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCODragMenuListItem.h"

#define MENU_DEFAULT_HEADER_VIEW_HEIGHT 44

@interface FLCOToolBarMenu : UIToolbar

@property (nonatomic, strong) UIView  *menuHeaderView; //Hidden view in minimized state.
@property (nonatomic, strong) NSArray *menuListItems;
@property (nonatomic, assign) BOOL isSuperViewGesture;
@property (nonatomic, assign) BOOL gesturesEnabled;
@property (nonatomic, readonly) UIToolbar *toolBar;

+ (instancetype)toolBarWithMenuHeaderView:(UIView*)menuHeaderView listItems:(NSArray*)menuItems;

- (void)reloadToolBarMenuWithCompletion:(void (^)(BOOL finished))completion;;

- (BOOL)isToolBarMenuOpened;

- (void)toggleToolBarMenuWithCompletion:(void (^)(BOOL finished))completion;

- (void)openToolBarMenuWithCompletion:(void (^)(BOOL finished))completion;;

- (void)closeToolBarMenuWithCompletion:(void (^)(BOOL finished))completion;

- (CGFloat)getDefaultToolBarHeight;

@end
