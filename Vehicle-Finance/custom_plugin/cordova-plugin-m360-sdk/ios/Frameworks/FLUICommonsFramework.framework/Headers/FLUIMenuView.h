//
//  FLUIMenuView.h
//  FLUIMenuView
//
//  Created by Suresh Mudireddy on 06/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOListViewItem.h"
#import "FLM360ProgressHUD.h"

#define MENU_DEFAULT_HEADER_VIEW_HEIGHT 44
#define DEFAULT_PROGRESS_DIALOG_HEIGHT 300
#define DEFAULT_PROGRESS_DIALOG_TITLE_HEIGHT 80

@interface FLUIMenuView : UIView

@property (nonatomic, strong) UIView  *menuHeaderView; //Hidden view in minimized state.
@property (nonatomic, strong) UIView  *menuFooterView; //Hidden view in minimized state.
@property (nonatomic, strong) NSArray *menuItems;
@property (nonatomic, readonly) UITableView *menuListView;

- (id)initWithMenuHeaderView:(UIView*)menuHeaderView withFooterView:(UIView*)menuFooterView menuItems:(NSArray*)items;

- (void)reloadMenuViewWithItems:(NSArray*)items withCompletion:(void (^)(BOOL finished))completion;

@end
