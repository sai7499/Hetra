//
//  FLMCSettingsUtil.h
//  MaaS360
//
//  Created by Naveen Murthy on 4/12/15.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>

#define CREATE_SETTINGS_ROW_TITLE_WITH_CUSTOM_VC(x,y,z) [FLMCSettingsUtil createSettingsWithTitle:x customViewControllerClass:y andKey:z]
#define CREATE_SETTINGS_ROW_TITLE_SUBTITLE_WITH_CUSTOM_VC(w,x,y,z) [FLMCSettingsUtil createSettingsWithTitle:w withSubtitle:x customViewControllerClass:y andKey:z]

#define CREATE_SETTINGS_ROW_TITLE_WITH_VALUE(x,y,z) [FLMCSettingsUtil createSettingsRowWithTitle:x withValue:y andKey:z]
#define CREATE_SETTINGS_ROW_TITLE_WITH_SUB_TITLE(x,y,z) [FLMCSettingsUtil createSettingsRowWithTitle:x withSubTitle:y andKey:z]

#define CREATE_SETTINGS_ROW_TITLE_WITH_SUB_TITLE_FONT_ADJUSTED(x,y,z,k) [FLMCSettingsUtil createSettingsRowWithTitle:x withSubTitle:y fontAdjusted:z andKey:k ]

#define CREATE_SETTINGS(x) [FLMCSettingsUtil createSettingsWithData:x]
#define CREATE_SETTINGS_ROW_GROUP_WITH_HEADER(x) [FLMCSettingsUtil createSettingsGroupWithTitle:x]
#define CREATE_SETTINGS_ROW_GROUP_WITH_HEADER_FOOTER(x,y) [FLMCSettingsUtil createSettingsGroupWithTitle:x andFooterText:y]

#define CREATE_SETTINGS_ROW_WITH_MUTIVALUE(x,y,z,k) \
[FLMCSettingsUtil createSettingsWithMutiValue:x withDefaultValue:y withTitle:z andKey:k]
#define CREATE_SETTINGS_ROW_WITH_MULTIVALUE_WITH_DETAILED_BUTTON(x,y,z,k,j) \
[FLMCSettingsUtil createSettingsWithMutiValue:x withDefaultValue:y withTitle:z andKey:k withDetailedButton:j]

#define CREATE_SETTINGS_ROW_WITH_MUTIVALUE_WITH_IMAGE(x,y,z,i,b,k) \
[FLMCSettingsUtil createSettingsWithMutiValue:x withDefaultValue:y withTitle:z withImageName:i withBundle:b andKey:k]
#define CREATE_SETTINGS_ROW_WITH_MUTIVALUE_WITH_FOOTER(x,y,z,f,k) \
[FLMCSettingsUtil createSettingsWithMutiValue:x withDefaultValue:y withTitle:z withfooter:f andKey:k]

#define CREATE_SETTINGS_ROW_TITLE_TEXT_FIELD(x,y,z,a,b) [FLMCSettingsUtil createSettingsRowWithTitle:x withTextFielsValue:y andKey:z isPassword:a labelAlignment:b]

#define CREATE_SETTINGS_ROW_TITLE_TEXT_FIELD_WITH_KEYBOARD_TYPE(x,y,z,a,b) [FLMCSettingsUtil createSettingsRowWithTitle:x withTextFielsValue:y andKey:z isPassword:a keyboardType:b]

#define CREATE_SETTINGS_ROW_WITH_TOOGLE_SWITCH(x,y,z) [FLMCSettingsUtil createSettingsToggleSwitchWithTitle:x withDefaultValue:y andKey:z]

#define CREATE_SETTINGS_ROW_WITH_BUTTON(x,y) [FLMCSettingsUtil createSettingsButtonWithTitle:x andKey:y]
#define CREATE_SETTINGS_ROW_WITH_DESTRUCTIVE_BUTTON(x,y,z) [FLMCSettingsUtil createSettingsDestructiveButtonWithTitle:x andKey:y andDestructive:z]
#define CREATE_SETTINGS_ROW_WITH_BUTTON_WITH_USER_DATA(x,y,z) [FLMCSettingsUtil createSettingsButtonWithTitle:x andKey:y withUserData:z]

#define CREATE_SETTINGS_ROW_WITH_BUTTON_LEFT_ALLIGN(x,y) [FLMCSettingsUtil createSettingsLeftAlignButtonWithTitle:x andKey:y]
#define CREATE_SETTINGS_ROW_WITH_BUTTON_RIGHT_ALLIGN(x,y) [FLMCSettingsUtil createSettingsRightAlignButtonWithTitle:x andKey:y]
#define CREATE_SETTINGS_ROW_WITH_BUTTON_CENTER_ALLIGN(x,y) [FLMCSettingsUtil createSettingsCenterAlignButtonWithTitle:x andKey:y]
#define CREATE_SETTINGS_ROW_WITH_BUTTON_AND_SUBTITLE(x,y,z) [FLMCSettingsUtil createSettingsButtonWithTitle:x withSubtitle:y andKey:z]
#define CREATE_SETTINGS_ROW_WITH_BUTTON_LEFT_ALLIGN_AND_SUBTITLE(x,y,z) [FLMCSettingsUtil createSettingsLeftAlignButtonWithTitle:x andSubtitle:y andKey:z]


#define CREATE_SETTINGS_ROW_WITH_BUTTON_AND_IMAGE(x,i,b,y)\
[FLMCSettingsUtil createSettingsImageButtonWithTitle:x withImage:i withBundle:b andKey:y]

#define CREATE_SETTINGS_ROW_WITH_BUTTON_LEFT_ALLIGN_AND_IMAGE(x,i,b,y) \
[FLMCSettingsUtil createSettingsImageButtonWithTitle:x withImage:i withBundle:b andKey:y]

#define CREATE_SETTINGS_ROW_WITH_BUTTON_RIGHT_ALLIGN_AND_IMAGE(x,i,b,y) \
[FLMCSettingsUtil createSettingsLeftAlignImageButtonWithTitle:x withImage:i withBundle:b andKey:y]

#define CREATE_SETTINGS_ROW_WITH_BUTTON_CENTER_ALLIGN_AND_IMAGE(x,i,b,y) \
[FLMCSettingsUtil createSettingsCenterAlignImageButtonWithTitle:x withImage:i withBundle:b andKey:y]

#define CREATE_SETTINGS_ROW_WITH_BUTTON_AND_SUBTITLE_AND_IMAGE(x,i,b,y,z) \
[FLMCSettingsUtil createSettingsImageButtonWithTitle:x withImage:i withBundle:b withSubtitle:y andKey:z]

#define CREATE_SETTINGS_ROW_WITH_CUSTOM_CELL(x,y) [FLMCSettingsUtil createCustomCellWithClass:x andKey:y]

#define CREATE_SETTINGS_ROW_FOR_CERTIFICATE(key, certName, certImageName, trustStatus, trustImageName, rootCertName, bundle) [FLMCSettingsUtil createCustomCellForCertificateWithKey:key withCertName:certName withCertImageName:certImageName withTrustStatus:trustStatus withTrustImageName:trustImageName withRootCertName:rootCertName withBundle:bundle]

#define CREATE_SETTINGS_ROW_FOR_TRUST_CHAIN(key,certName,issuer,expiryDate) [FLMCSettingsUtil createCustomCellForCertificateTrustChainWithKey:key withCertName:certName withIssuer:issuer withExpiry:expiryDate]

#define CREATE_SETTINGS_ROW_WITH_MUTIVALUE_AND_INDICES(x,y,z,k,f) \
[FLMCSettingsUtil createSettingsWithMutiValue:x withIndices:y withDefaultValue:z withTitle:k andKey:f]

#define CREATE_SETTINGS_ROW_WITH_TOOGLE_SWITCH_AND_SUBTITLE(x,y,z,k) [FLMCSettingsUtil createSettingsToggleSwitchWithTitle:x withDefaultValue:y andKey:z andSubtitle: k]


@interface FLMCSettingsUtil : NSObject

+(NSDictionary *)createSettingsWithData:(NSArray *)data;

+(NSDictionary *)createSettingsWithTitle:(NSString *)title customViewControllerClass:(NSString *)className andKey:(NSString *)key;

+(NSDictionary *)createSettingsWithTitle:(NSString *)title withSubtitle:(NSString *)subtitle customViewControllerClass:(NSString *)classname andKey:(NSString *)key;

+(NSDictionary *)createSettingsRowWithTitle:(NSString *)title withValue:(NSString *)value andKey:(NSString *)key;

+(NSDictionary*)createSettingsRowWithTitle:(NSString *)title withSubTitle:(NSString *)subTitle andKey:(NSString *)key;

+(NSDictionary*)createSettingsRowWithTitle:(NSString *)title withSubTitle:(NSString *)subTitle fontAdjusted:(NSNumber*)adjusted andKey:(NSString *)key;

+(NSDictionary *)createSettingsGroupWithTitle:(NSString *)title;
+(NSDictionary *)createSettingsGroupWithTitle:(NSString *)title andFooterText:(NSString *)footerText;

+(NSDictionary *)createSettingsWithMutiValue:(NSArray *)values withDefaultValue:(int)index withTitle:(NSString *)title andKey:(NSString *)key;
+(NSDictionary *)createSettingsWithMutiValue:(NSArray *)values withDefaultValue:(int)index withTitle:(NSString *)title andKey:(NSString *)key withDetailedButton:(BOOL)isDetailedButton;
+(NSDictionary *)createSettingsWithMutiValue:(NSArray *)values withDefaultValue:(int)index withTitle:(NSString *)title withImageName:(NSString *)imageName withBundle:(NSBundle *)bundle andKey:(NSString *)key;

+(NSDictionary *)createSettingsWithMutiValue:(NSArray *)values withDefaultValue:(int)index withTitle:(NSString *)title withfooter:(NSString *)footer andKey:(NSString *)key;

+(NSDictionary *)createSettingsRowWithTitle:(NSString*)title withTextFielsValue:(NSString*)value andKey:(NSString*)key isPassword:(NSString*)ispassword labelAlignment:(NSString*)alignment;

+(NSDictionary *)createSettingsRowWithTitle:(NSString*)title withTextFielsValue:(NSString*)value andKey:(NSString*)key isPassword:(NSString*)ispassword keyboardType:(NSString*)keyboardType;

+(NSDictionary *)createSettingsToggleSwitchWithTitle:(NSString *)title withDefaultValue:(BOOL)value andKey:(NSString *)key;

+(NSDictionary *)createSettingsToggleSwitchWithTitle:(NSString *)title withDefaultValue:(BOOL)value andKey:(NSString *)key andSubtitle: (NSString *)k;

+(NSDictionary *)createSettingsButtonWithTitle:(NSString *)title andKey:(NSString *)key;
+(NSDictionary *)createSettingsDestructiveButtonWithTitle:(NSString* )title andKey:(NSString*)key andDestructive:(BOOL)value;
+(NSDictionary *)createSettingsButtonWithTitle:(NSString *)title andKey:(NSString *)key withUserData:(id)data;

+(NSDictionary *)createSettingsLeftAlignButtonWithTitle:(NSString *)title andKey:(NSString *)key;
+(NSDictionary *)createSettingsCenterAlignButtonWithTitle:(NSString *)title andKey:(NSString *)key;
+(NSDictionary *)createSettingsButtonWithTitle:(NSString *)title withSubtitle:(NSString *)subtitle andKey:(NSString *)key;


+(NSDictionary *)createSettingsImageButtonWithTitle:(NSString *)title withImage:(NSString*)imageName withBundle:(NSBundle *)bundle andKey:(NSString *)key;
+(NSDictionary *)createSettingsLeftAlignImageButtonWithTitle:(NSString *)title withImage:(NSString*)imageName withBundle:(NSBundle *)bundle andKey:(NSString *)key;
+(NSDictionary *)createSettingsCenterAlignImageButtonWithTitle:(NSString *)title withImage:(NSString*)imageName withBundle:(NSBundle *)bundle andKey:(NSString *)key;
+(NSDictionary *)createSettingsImageButtonWithTitle:(NSString *)title withImage:(NSString*)imageName withBundle:(NSBundle *)bundle withSubtitle:(NSString *)subtitle andKey:(NSString *)key;

+(NSDictionary *)createCustomCellWithClass:(NSString *)className andKey:(NSString *)key;

+(NSDictionary *)createCustomCellForCertificateWithKey:(NSString*)key withCertName:(NSString*)certName withCertImageName:(NSString*)certImageName withTrustStatus:(NSNumber*)trustStatus withTrustImageName:(NSString*)trustImage withRootCertName:(NSString*)rootCertName withBundle:(NSBundle*)bundle;

+(NSDictionary *)createCustomCellForCertificateTrustChainWithKey:(NSString*)key withCertName:(NSString*)certName withIssuer:(NSString*)issuer withExpiry:(NSString*)expiryDate;
+(NSDictionary *)createSettingsLeftAlignButtonWithTitle:(NSString *)title andSubtitle:(NSString *)subtitle andKey:(NSString *)key;

+(NSDictionary *)createSettingsWithMutiValue:(NSArray *)values withIndices:(NSArray *)indices withDefaultValue:(id)defaultValue withTitle:(NSString *)title andKey:(NSString *)key;

@end
