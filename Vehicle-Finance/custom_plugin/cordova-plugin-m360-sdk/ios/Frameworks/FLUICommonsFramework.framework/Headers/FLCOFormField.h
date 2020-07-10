//
//  FormField.h
//  core
//
//  Created by Naresh SVS on 17/08/12.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

typedef enum
{
   UnknownField,
   TextField,
   PickerCellView,
   LableField,
   SwitchField,
   ServerAddressField,
   CheckBOxField,
   NormalTextField
}FormFieldType;

@interface FLCOFormField : NSObject
{
    BOOL _required;
    NSString *_displayName;
    NSInteger _fieldId;
    NSString *_fieldName;
    NSString *_defaultValue;
    BOOL _isSecure;
    UIKeyboardType _keyBoadType;
    UITextAutocorrectionType autoCorrectionType;
    FormFieldType _fieldType;
    
    //selected picker text will be in this value
    NSString *_selectedPickerText;
    //array of picker values
    NSArray *_pickerContent;
    //this is for overriding table view cell
    NSString *_rightLabel;
    NSString *_leftLabel;
    
    //To hold any context data which is used at the time of form submission.
    NSDictionary *_userContextData;
    
    BOOL _editable;
}

@property(nonatomic, assign) BOOL required;
@property(nonatomic, assign) BOOL editable;
@property(nonatomic, strong) NSString* displayName;
@property(nonatomic, strong) NSString* placeholderName;
@property(nonatomic, strong) NSString* accessoryTitle;
@property(nonatomic, readonly) NSInteger fieldId;
@property(nonatomic, strong) NSString* fieldName;
@property(nonatomic, strong) NSString* defaultValue;
@property(nonatomic, assign) BOOL isSecure;
@property(nonatomic, assign) UIKeyboardType keyBoardType;
@property(nonatomic, assign) UITextAutocorrectionType autoCorrectionType;
@property(nonatomic)BOOL validateidentifier;
@property(nonatomic,assign) FormFieldType fieldType;
@property(nonatomic,strong) NSString *rightLabel;
@property(nonatomic,strong) NSString *leftLabel;
@property(nonatomic,strong) NSArray *pickerContent;
@property(nonatomic,strong) NSString *selectedPickerText;
@property(nonatomic, strong) NSDictionary *userContextData;

- (id) initWithDisplayName:(NSString *) displayName;

@end
