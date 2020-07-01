//
//  FormDataSource.h
//  core
//
//  Created by Naresh SVS on 17/08/12.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class FLCOFormConfig;
@class FLCOFormField;

@interface FLCOFormDataSource : NSObject <UITextFieldDelegate>
{
    @protected
        FLCOFormConfig *_formConfig;
}

@property(nonatomic,strong) FLCOFormConfig* formConfig;

-(id) initWithCofig:(FLCOFormConfig *) config;
-(NSString *) getSubmitButtonText;
-(NSString *) getFormHeader;
-(NSString *) getFormFooterFormFieldsForSection:(NSInteger) section;
-(NSInteger) getNumberOfFormFieldsForSection:(NSInteger ) section;
-(FLCOFormField *) getFormFieldAtIndex:(NSInteger) row;
-(NSString *) getFormName;
-(NSString *) getSelectableLinkText;
-(NSArray *) getFooterViewArray;

-(NSString *) getFormHeaderMessage;
-(NSDictionary*)getHeaderConfiguration;
-(NSDictionary*)getBrandableHeaderConfiguration;
-(NSString*) getOptionButtonText;
-(BOOL) getShowOptionalButton;
-(BOOL) checkConfigSanity;
-(NSString*)showLoadingMessage;

-(NSInteger) getNumberOfSections;

-(NSInteger) getIntegerForIndexPath:(NSIndexPath *) indexPath;
-(NSIndexPath *) getIndexPathForInteger:(NSInteger) integer;

-(BOOL) anyTextFields;

@end
