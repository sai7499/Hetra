//
//  RMUniversalAlert.h
//  RMUniversalAlert
//
//  Created by Ryan Maxwell on 19/11/14.
//  Copyright (c) 2014 Ryan Maxwell. All rights reserved.
//

#import "UIAlertController+Blocks.h"
#import "FLCOAlertViewContext.h"
#import "FLCOUIUtils.h"

@interface RMUniversalAlert : NSObject

+ (id)showAlertInViewController:(UIViewController *)viewController
                        withTitle:(NSString *)title
                          message:(NSString *)message
                cancelButtonTitle:(NSString *)cancelButtonTitle
           destructiveButtonTitle:(NSString *)destructiveButtonTitle
                otherButtonTitles:(NSArray *)otherButtonTitles
                           sender:(id) sender
                         tapBlock:(void (^)(NSInteger buttonIndex,id sender))tapBlock;

+ (id)showActionSheetInViewController:(UIViewController *)viewController
                              withTitle:(NSString *)title
                                message:(NSString *)message
                      cancelButtonTitle:(NSString *)cancelButtonTitle
                 destructiveButtonTitle:(NSString *)destructiveButtonTitle
                      otherButtonTitles:(NSArray *)otherButtonTitles
                                 sender:(id)sender 
                               tapBlock:(void (^)(NSInteger buttonIndex,id sender))tapBlock;

+ (id)showAlertInViewController:(UIViewController *)viewController
                      withTitle:(NSString *)title
                        message:(NSString *)message
              cancelButtonTitle:(NSString *)cancelButtonTitle
         destructiveButtonTitle:(NSString *)destructiveButtonTitle
              otherButtonTitles:(NSArray *)otherButtonTitles
                         sender:(id) sender
                          style:(FLCOAlertViewStyle)alertStyle
                       tapBlock:(void (^)(NSInteger buttonIndex, NSArray *textFields,id sender))tapBlock;

@end
