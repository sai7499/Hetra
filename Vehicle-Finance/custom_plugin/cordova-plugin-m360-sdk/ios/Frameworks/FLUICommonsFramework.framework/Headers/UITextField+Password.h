//
//  UITextField+Password.h
//  FLUICommons
//
//  Created by Prasad Pallela on 6/7/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UITextField (Password)<UITextFieldDelegate>
@property (strong, nonatomic) NSString *btnEnabled;
- (void)showEye:(BOOL)showEye;

@end
