//
//  UIAlertViewBlockUtil.h
//  FLUICommons
//
//  Created by Karthik Ramgopal on 20/05/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "FLCOAlertViewContext.h"

typedef void (^LeftButtonActionBlock)(void);
typedef void (^RightButtonActionBlock)(NSString *, ...);

@interface UIAlertViewBlockUtil : NSObject

- (instancetype)initWithTitle:(NSString *)title
                      message:(NSString *)message
                        alert:(FLCOAlertViewStyle)style
              leftButtonTitle:(NSString *)leftButtonTitle
             leftButtonAction:(LeftButtonActionBlock)leftButtonActionBlock
             rightButtonTitle:(NSString *)rightButtonTitle
            rightButtonAction:(RightButtonActionBlock)rightButtonActionBlock;
- (void)show;

@end
