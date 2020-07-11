//
//  CRFormActionDelegate.h
//  core
//
//  Created by Naresh SVS on 19/08/12.
//
//

#import <Foundation/Foundation.h>
#import "FLCOFormConfig.h"
#import "FLCOErrorModel.h"
#import "FLCOHttpOperationDelegate.h"
#import "M13Checkbox.h"

@interface FLCOFormActionDelegate : NSObject
{
    FLCOFormConfig* _config;
}
@property(nonatomic,strong) FLCOFormConfig* config;

- (id) initWithFormConfig:(FLCOFormConfig *)formConfig;

- (void) executeFormAction:(NSMutableDictionary *) formFields withDelegate:(id<FLCOHttpOperationDelegate>) httpDelegate;
- (BOOL) validateFormData:(NSMutableDictionary *) formFields;
- (void) cancelAction;
- (void) cancelAuthentication;
- (BOOL) processResponse:(id) response withUserContext:(id)userContext;
- (BOOL) isRequestSucceeded:(id) response;
- (FLCOErrorModel *) getErrorInfo:(id) response;

- (void) didSubmissionAbortedFormData:(NSMutableDictionary *) formFields;

- (BOOL) shouldSubmitFormData:(NSMutableDictionary *) formFields;
- (BOOL) shouldFollowLink:(NSString*)link withDelegate:(id<FLCOHttpOperationDelegate>) httpDelegate;

- (BOOL) shouldHideNavigationBar;

- (BOOL) shouldHideNavigationBarDefaultBackButton;

- (BOOL) shouldHideTableHeaderMessage;

- (BOOL) showHelpButton;

- (BOOL) shouldHideVerifying;

- (BOOL) shouldShowResetLocalizedBackButton;

- (BOOL) appResetFetchConfigureState:(UINavigationController *) controller;

- (BOOL)isValidPassword:(NSString*)password;

- (FLCOFormConfig*) getFormConfig;

- (void)switchFied:(UISwitch *)switchView valueChangedTo:(BOOL)value;

- (void)checkBoxFiedvalueChangedTo:(BOOL)value;

- (void) editViewRequest:(NSMutableDictionary *) formFields;

@end
