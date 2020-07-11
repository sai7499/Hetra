//
//  FLCOAlertViewContext.h
//  commons
//
//  Created by Mayur Kothawade on 12/20/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIView.h>


typedef enum {
    FLCOAlertViewStyleDefault = 0,
    FLCOAlertViewStyleSecureTextInput,
    FLCOAlertViewStylePlainTextInput,
    FLCOAlertViewStyleLoginAndPasswordInput,
    FLCOAlertViewStylePhonePad,
    FLCOAlertViewStyleLoginDomainAndPasswordInput
} FLCOAlertViewStyle;

@class FLCOAlertViewContext;

typedef void (^AlertViewCompletionBlock)(NSUInteger,NSString *);

@interface FLCOAlertViewContext : NSObject

/*
 alertViewId - It should be unique for every different alert in your application.
 (AlertViewManager would rejetct all duplicate alerts)
 */
@property(nonatomic, strong) NSString *alertViewId;
@property(nonatomic, assign) FLCOAlertViewStyle alertViewStyle;

@property(nonatomic, strong) NSString *alertViewTitle;
@property(nonatomic, strong) NSString *alertViewMessage;
@property(nonatomic, strong) NSString *alertViewCancelButtonTitle;
/*
 alertViewOtherButtonTitles - comma separated string of button titles if there are many.
 */
@property(nonatomic, strong) NSString *alertViewOtherButtonTitles;
@property(nonatomic, weak) id alertViewDelegate;
@property(nonatomic, strong) id alertViewUserContext;

@property (nonatomic, readwrite, strong) AlertViewCompletionBlock completionBlock;

@property (nonatomic, readwrite, strong) void (^alertViewTapBlock) (NSUInteger buttonIndex, NSArray *textFields,FLCOAlertViewContext* alertContext,id sender);

@property (nonatomic)BOOL isDuplicateAllowed;

-(void)setAlertViewTapBlock:(void (^)(NSUInteger buttonIndex, NSArray * textFields, FLCOAlertViewContext *context, id sender))alertViewTapBlock;

-(id)init;

@property(nonatomic)BOOL shouldNotEnque;

@end
