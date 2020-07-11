//
//  FLCOMenuViewHUD.h
//  FLCOMenuViewHUD
//
//  Created by Suresh Mudireddy on 06/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOListViewItem.h"
#import "FLM360ProgressHUD.h"

#define MENU_DEFAULT_HEADER_VIEW_HEIGHT 44
#define DEFAULT_PROGRESS_DIALOG_TITLE_HEIGHT 80

extern NSString *const kHUDMenuListItems;
extern NSString *const kHUDMenuUserCanCancel;
extern NSString *const kHUDMenuMenuHeaderMessage;
extern NSString *const kHUDMenuMenuUserCancelHandler;

@interface FLCOMenuViewHUD : FLM360ProgressHUD

@property (nonatomic, strong) UIView  *menuHeaderView; //Hidden view in minimized state.
@property (nonatomic, strong) UIView  *menuFooterView; //Hidden view in minimized state.
@property (nonatomic, strong) NSArray *menuItems;
@property (nonatomic, readonly) UITableView *menuListView;

+ (FLCOMenuViewHUD *)showHUDAddedTo:(UIView *)view animated:(BOOL)animated withMenuHeaderView:(UIView*)menuHeaderView withFooterView:(UIView*)menuFooterView menuItems:(NSArray*)items;

- (id)initWithView:(UIView *)view withMenuHeaderView:(UIView*)menuHeaderView withFooterView:(UIView*)menuFooterView menuItems:(NSArray*)items;

- (id)initWithMenuHeaderView:(UIView*)menuHeaderView withFooterView:(UIView*)menuFooterView menuItems:(NSArray*)items;

- (void)shouldAddToView:(UIView*)view;

- (void)reloadMenuViewWithItems:(NSArray*)items withCompletion:(void (^)(BOOL finished))completion;

@end
