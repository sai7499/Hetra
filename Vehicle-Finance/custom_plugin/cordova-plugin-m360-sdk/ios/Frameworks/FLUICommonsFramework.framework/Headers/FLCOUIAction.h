//
//  FLCOUIAction.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 29/08/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIkit.h>
#import <Foundation/Foundation.h>


typedef NS_ENUM(NSInteger, FLCOUIActionStyle) {
    /** The button is displayed with a regular font and positioned right below the content view. */
    FLCOUIActionStyleDone,
    /** The button is displayed with a bold font and positioned below all done buttons (or the content view if there are no done buttons). */
        FLCOUIActionStyleCancel,
    /** The button is displayed with a standard destructive and positioned right below the content view. Currently only supported when blur effects are disabled.*/
        FLCOUIActionStyleDestructive,
    /** The button is displayed with a regular font and positioned above the content view. */
        FLCOUIActionStyleAdditional,
    /** The button is displayed and positioned like a done button. */
        FLCOUIActionStyleDefault =     FLCOUIActionStyleDone
};

@interface FLCOUIAction : NSObject

@property (nonatomic, readonly) NSString *title;
@property (nonatomic, readonly) UIImage *image;
@property (nonatomic, readonly) FLCOUIActionStyle style;
@property (nonatomic, assign) BOOL dismissesActionController;
@property (nonatomic, weak) id controller;
@property (nonatomic, strong) UIColor *textColor;
@property (nonatomic, strong) UIColor *selectedTextColor;
@property (nonatomic, assign) NSUInteger actionTag;
@property (nonatomic, assign) BOOL selected;
@property (nonatomic, strong) FLCOUIAction *parentActionContainerObj;


+ (instancetype)actionWithTitle:(NSString *)title style:(FLCOUIActionStyle)style andHandler:(void (^)(id controller,FLCOUIAction *action))handler;

+ (instancetype)actionWithImage:(UIImage *)image style:(FLCOUIActionStyle)style andHandler:(void (^)(id controller,FLCOUIAction *action))handler;

- (UIView *)actionView;
- (BOOL)isACancelAction;
- (void)executeHandlerOfCancelActionWithController:(id)controller;

@end
