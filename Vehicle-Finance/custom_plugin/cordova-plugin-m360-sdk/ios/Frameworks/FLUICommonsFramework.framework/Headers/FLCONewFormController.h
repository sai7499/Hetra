//
//  LoginViewController.h
//  MaaS360
//
//  Created by Mudireddy Suresh on 02/07/12.
//  Copyright (c) 2012 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOHttpOperationDelegate.h"
#import "FLCOAttributedLabel.h"
#import "FLM360ProgressHUD.h"

@class FLCOFormConfig;
@class FLCOFormDataSource;
@class FLCOFormActionDelegate;

@interface FLCONewFormController : UIViewController <UITableViewDataSource, UITextFieldDelegate, FLCOHttpOperationDelegate,UITableViewDelegate, FLCOAttributedLabelDelegate,MBProgressHUDDelegate, UIPickerViewDelegate, UIPickerViewDataSource,UIPopoverControllerDelegate>
{
    UITableView *_dataTable;
    FLCOFormDataSource* _dataSource;
    FLCOFormActionDelegate* _actionDelegate;
    NSMutableDictionary *_textFieldMapping,*_labelMapping;
    UIButton *_actionButton;
    NSMutableDictionary *_pickerFieldMapping;
}
@property(nonatomic, strong) FLM360ProgressHUD *progressView;
@property (nonatomic, strong) UITableView *dataTable;
@property (nonatomic, strong) UIButton *actionButton;
@property (nonatomic, strong) UIButton *optionalButton;
@property (nonatomic, strong) FLCOFormDataSource* dataSource;
@property (nonatomic, strong) FLCOFormActionDelegate* actionDelegate;

- (id) initWithFormDataSource:(FLCOFormDataSource *) ds andActionDelegate:(FLCOFormActionDelegate *) delegate withBundle:(NSBundle *)bundle;
-(void) cancelRequest;
-(void) editViewRequest:(NSMutableDictionary *) formFields;
-(void) cancelRequestWithOutDismissingViewController;
-(void) didBeginRequest;
-(void) didEndRequest;
-(void) reloadFormUI;
-(void)hideLoadingAlertMessage;

-(void)showBannerMessage:(NSString*)message;
-(void)hideBannerMessageView;
-(void)sendAgentLogs;
@end
