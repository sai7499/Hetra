//
//  FLCODragMenu.h
//  FLCODragMenu
//
//  Created by Suresh Mudireddy on 06/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCODragMenuListItem.h"

typedef NS_ENUM(NSInteger, FLCODragMenuType) {
    FLCODragMenuFromTop,
    FLCODragMenuFromBottom
};

@interface FLCODragMenu : UIViewController

@property (nonatomic, strong) UIView      *menuHeaderView; //Visible view in minimized state.
@property (nonatomic, strong) UIView      *menuSubHeaderView; //Hidden view in minimized state.
@property (nonatomic, assign) FLCODragMenuType   dragMenuType; //Hidden view in minimized state.
@property (nonatomic, strong) NSArray *menuListItems;
@property (nonatomic, assign) BOOL isSuperViewGesture;

+ (instancetype)dragMenuOfType:(FLCODragMenuType)type withHeaderView:(UIView*)headerView ;

+ (instancetype)dragMenuWithHeaderView:(UIView*)headerView menuItems:(NSArray*)items;

+ (instancetype)dragMenuWithHeaderView:(UIView*)headerView withSubHeaderView:(UIView*)subHeaderView;

+ (instancetype)dragMenuOfType:(FLCODragMenuType)type WithHeaderView:(UIView*)headerView withSubHeaderView:(UIView*)subHeaderView listItems:(NSArray*)menuItems;

- (void)reloadDragMenu;

- (void)showDragMenuInViewController:(UIViewController *)vc;

- (void)showDragMenuInView:(UIView*)view superViewGesture:(BOOL)isSuperViewGesture;

- (BOOL)isDragMenuOpened;

- (void)toggleDragMenu;

- (void)openDragMenu;

- (void)closeDragMenu;

- (void) viewWillRotate;

- (void) viewDidRotate;

@end
