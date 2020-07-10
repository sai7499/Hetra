//
//  FormConfig.h
//  core
//
//  Created by Naresh SVS on 17/08/12.
//
//

#import <Foundation/Foundation.h>
#import "FLCOFormFooterField.h"

@class FLCOFormField;

@interface FLCOFormConfig : NSObject
{
    NSString* _formName;
    NSArray*  _formFields;
    NSString* _formActionURL;
    NSString* _header;
    NSArray* _footerMessages;
    NSString* _submitButtonText;
    NSString* _selectableLinkText;
    NSArray *_groupedFormFields;
}

@property(nonatomic, strong) NSString* formName;
@property(nonatomic, strong) NSArray*  formFields;
@property(nonatomic, strong) NSArray*  groupedFormFields;
@property(nonatomic, strong) NSString* formActionURL;
@property(nonatomic, strong) NSString* header;
@property(nonatomic, strong) NSArray* footerMessages;
@property(nonatomic, strong) NSString* formHeaderMessage;
@property(nonatomic, strong) NSString* submitButtonText;
@property(nonatomic, strong) NSString* optionalButtonText;
@property(nonatomic, strong) NSString* selectableLinkText;
@property(nonatomic, strong) NSString* loadingMessage;
@property(nonatomic,strong) NSArray *formFooterViews; // Note: order here is important, view at index 0 will be put at the top

@property(nonatomic, strong) NSDictionary* headerConfiguration;
@property(nonatomic, strong) NSDictionary* brandableHeaderConfiguration;
@property(nonatomic) BOOL shouldHideNavigationBar;
@property(nonatomic) BOOL shouldHideTableHeaderMessage;
@property(nonatomic) BOOL shouldHideVerifying;
@property(nonatomic) BOOL shouldShowResetLocalizedBackButton;
@property(nonatomic) BOOL shouldHideDefaultBackButton;
@property(nonatomic) BOOL showOptionalButton;
@property(nonatomic) BOOL showHelpButton;


- (NSInteger) getNumOfFieldsForSection:(NSInteger) section;
- (FLCOFormField *) getFieldAtIndex:(NSInteger) index;

-(BOOL) footerSanityCheck;
-(NSString*)getLodingMessage;

-(NSInteger) getIntegerForIndexPath:(NSIndexPath *) indexPath;
-(NSIndexPath *) getIndexPathFromInteger:(NSInteger) intValue;

-(NSInteger) getNUmOfSections;

- (NSString*) getFooterMessageForSection:(NSInteger) section;

@end
