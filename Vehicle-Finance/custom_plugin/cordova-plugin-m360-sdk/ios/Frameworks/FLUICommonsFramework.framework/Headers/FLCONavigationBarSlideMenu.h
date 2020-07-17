//
//  FLCONavigationPopover.h
//  FLCONaigationbarPopover
//
//  Created by Naveen Murthy on 12/31/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCONavigationBarSlideMenuAction.h"

typedef NS_ENUM(NSInteger, FLCONavigationPopoverStyle) {
    FLCONavigationPopoverStyleFromTop,
    FLCONavigationPopoverStyleFromBottom
};

@class FLCONavigationBarSlideMenu;

@protocol FLCONavigationBarSlideMenuDelegate <NSObject>
- (BOOL)shouldDismissMenuAfterSelection;

@optional

- (void)slideMenu:(FLCONavigationBarSlideMenu *)slideMenu clickedButtonAtIndex:(NSInteger)buttonIndex withActionHandler:(FLCONavigationBarSlideMenuAction *)actionHandler;

- (void)slideMenu:(FLCONavigationBarSlideMenu *)slideMenu clickedButtonAtIndex:(NSInteger)buttonIndex;

-(void) willHideMenu:(FLCONavigationBarSlideMenu *)slideMenu ;

- (UIColor*)textColorForAction:(NSString*)action inSlideMenu:(FLCONavigationBarSlideMenu *)slideMenu;
- (UIColor*)backgroundColorForAction:(NSString*)action inSlideMenu:(FLCONavigationBarSlideMenu *)slideMenu;

-(BOOL)slideMenu:(FLCONavigationBarSlideMenu *)slideMenu shouldEnableSlideMenuAction:(FLCONavigationBarSlideMenuAction*)slideMenuAction;

@end

@interface FLCONavigationBarSlideMenu : UIViewController <UITableViewDataSource,UITableViewDelegate,UIGestureRecognizerDelegate>
{
    UITableView *dropdownMenu;
    FLCONavigationPopoverStyle preferredStyle;
}

@property (nonatomic,strong) UIView *headerView;
@property (nonatomic,weak) id <FLCONavigationBarSlideMenuDelegate> delegate;
@property (nonatomic, strong) id userInfo;
@property (nonatomic) BOOL simulatedChanges;
@property (nonatomic) CGFloat simulatedNavigationbarHeight,simulatedStatusbarHeight, simulatedFont;
@property (nonatomic) CGRect simulatedFrame; // needed becuase in iOS 7 the navigation controller will not give correct frame.


+ (instancetype)navigaitonPopoverControllerWithPreferredStyle:(FLCONavigationPopoverStyle)preferredStyle;

- (void) addAction:(FLCONavigationBarSlideMenuAction *)action;
- (void) updateMenuData;
- (int)  getDropdownHeight;
- (void) showDropdownInViewController:(UIViewController *)vc inView:(id)sender;
- (void) hideDropdownInViewController;
- (BOOL) isShowingDropDownMenu;
- (NSString *)buttonTitleAtIndex:(NSInteger)buttonIndex;
- (id) getSender;
@end
