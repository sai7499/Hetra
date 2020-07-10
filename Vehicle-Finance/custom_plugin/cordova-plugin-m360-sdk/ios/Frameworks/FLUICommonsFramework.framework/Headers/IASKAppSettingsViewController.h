//
//  IASKAppSettingsViewController.h
//  http://www.inappsettingskit.com
//
//  Copyright (c) 2009:
//  Luc Vandal, Edovia Inc., http://www.edovia.com
//  Ortwin Gentz, FutureTap GmbH, http://www.futuretap.com
//  All rights reserved.
//
//  It is appreciated but not required that you give credit to Luc Vandal and Ortwin Gentz,
//  as the original authors of this code. You can give credit in a blog post, a tweet or on
//  a info page of your app. Also, the original authors appreciate letting them know if you use this code.
//
//  This code is licensed under the BSD license that is available at: http://www.opensource.org/licenses/bsd-license.php
//

#import <UIKit/UIKit.h>
#import <MessageUI/MessageUI.h>

#import "IASKSettingsStore.h"
#import "IASKViewController.h"
#import "IASKSpecifier.h"
#import "TPKeyboardAvoidingTableView.h"

@class IASKSettingsReader;
@class IASKAppSettingsViewController;

typedef enum : NSUInteger {
    IASKSettingsReaderNormalMode = 0,
    IASKSettingsReaderDataMode = 1
} IASKSettingsReaderMode;


@protocol IASKSettingsDelegate
- (void)settingsViewControllerDidEnd:(IASKAppSettingsViewController*)sender;

@optional
#pragma mark - View delegates
- (void)settingsViewWillAppear:(BOOL)animated;
- (void)settingsViewDidAppear:(BOOL)animated;
- (void)settingsViewWillDisappear:(BOOL)animated;
- (void)settingsViewDidDisappear:(BOOL)animated;

#pragma mark - UITableView header customization
- (CGFloat) settingsViewController:(id<IASKViewController>)settingsViewController
                         tableView:(UITableView *)tableView
         heightForHeaderForSection:(NSInteger)section;
- (UIView *) settingsViewController:(id<IASKViewController>)settingsViewController
                          tableView:(UITableView *)tableView
            viewForHeaderForSection:(NSInteger)section;

#pragma mark - UITableView footer customization
-(CGFloat)settingsViewController:(id<IASKViewController>)settingsViewController tableView:(UITableView *)tableView heightForFooterForSection:(NSInteger)section;
-(UIView*)settingsViewController:(id<IASKViewController>)settingsViewController tableView:(UITableView *)tableView viewForFooterForSection:(NSInteger)section;

#pragma mark - UITableView cell customization
- (CGFloat)tableView:(UITableView*)tableView heightForSpecifier:(IASKSpecifier*)specifier;
- (UITableViewCell*)tableView:(UITableView*)tableView cellForSpecifier:(IASKSpecifier*)specifier;
- (void)interactionForCell:(UITableViewCell*)cell forSpecifier:(IASKSpecifier*)specifier;

#pragma mark - mail composing customization
- (NSString*) settingsViewController:(id<IASKViewController>)settingsViewController
         mailComposeBodyForSpecifier:(IASKSpecifier*) specifier;

- (UIViewController<MFMailComposeViewControllerDelegate>*) settingsViewController:(id<IASKViewController>)settingsViewController
                                     viewControllerForMailComposeViewForSpecifier:(IASKSpecifier*) specifier;

- (UIViewController*) settingsViewController:(id<IASKViewController>)settingsViewController
                                     viewControllerForMultiValueForSpecifier:(IASKSpecifier*) specifier;

-(BOOL)settingsViewController:(id<IASKViewController>)settingsViewController shouldShowViewControllerAsSplitViewDetailControllerForMultiValueForSpecifier:(IASKSpecifier*) specifier ;

- (void) settingsViewController:(id<IASKViewController>) settingsViewController
          mailComposeController:(MFMailComposeViewController*)controller
            didFinishWithResult:(MFMailComposeResult)result
                          error:(NSError*)error;

#pragma mark - respond to button taps
- (void)settingsViewController:(IASKAppSettingsViewController*)sender buttonTappedForKey:(NSString*)key __attribute__((deprecated)); // use the method below with specifier instead
- (void)settingsViewController:(IASKAppSettingsViewController*)sender buttonTappedForSpecifier:(IASKSpecifier*)specifier;
- (void)settingsViewController:(IASKAppSettingsViewController*)sender tableView:(UITableView *)tableView didSelectCustomViewSpecifier:(IASKSpecifier*)specifier;

- (void)settingsViewController:(IASKAppSettingsViewController*)sender tableView:(UITableView *)tableView didSelectViewSpecifier:(IASKSpecifier*)specifier;


#pragma mark - UITableView header customization
-(void)showCustomChildPanelWithSpecifier:(IASKSpecifier *)specifier;
@end


@interface IASKAppSettingsViewController : UIViewController <IASKViewController, UITableViewDelegate,UITableViewDataSource,UITextFieldDelegate, MFMailComposeViewControllerDelegate>

@property (nonatomic, weak) IBOutlet id delegate;
@property (nonatomic, assign) IASKSettingsReaderMode mode;
@property (nonatomic, copy) NSString *file;
@property (nonatomic, assign) BOOL showCreditsFooter;
@property (nonatomic, assign) IBInspectable BOOL showDoneButton;
@property (nonatomic, retain) NSSet *hiddenKeys;
@property (nonatomic) IBInspectable BOOL neverShowPrivacySettings;
@property (nonatomic, retain,readonly) TPKeyboardAvoidingTableView *tableView;

@property (nonatomic, assign) BOOL isMasterSettingsController;

-(instancetype)initWithData:(NSDictionary *)data;
-(instancetype)initWithData:(NSDictionary *)data withStyle:(UITableViewStyle)style;

- (void)synchronizeSettings;
- (void)dismiss:(id)sender;
- (void)setHiddenKeys:(NSSet*)hiddenKeys animated:(BOOL)animated;
- (NSDictionary*) getCurrentSettingsData;
-(void)setLeftNavigaitonBarButton:(NSArray *)leftButtons;
-(void)setRightNavigaitonBarButton:(NSArray *)leftButtons;

- (NSArray *)getCompleteData;
-(id)getCurrentValueForKey:(NSString *)key;

-(void)updateData:(NSDictionary *)data;

@end
