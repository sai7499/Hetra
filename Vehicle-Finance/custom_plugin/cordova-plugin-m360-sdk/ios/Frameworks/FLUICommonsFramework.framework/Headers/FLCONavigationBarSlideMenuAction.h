//
//  FLCONavigationPopoverAction.h
//  FLCONaigationbarPopover
//
//  Created by Naveen Murthy on 12/31/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class FLCONavigationBarSlideMenuAction;

typedef void(^ActionHandler)(FLCONavigationBarSlideMenuAction *action);

@interface FLCONavigationBarSlideMenuAction : NSObject

+ (instancetype)actionWithTitle:(NSString *)title image:(UIImage *)image handler:(ActionHandler)handler;

@property (nonatomic, readonly) NSString *title;
@property (nonatomic, readonly) UIImage *image;
@property (nonatomic, readwrite,copy) ActionHandler actionHandler;
@property (nonatomic, assign) BOOL actionEnabled;
@property (nonatomic, assign) BOOL isDefaultAction;

@end
