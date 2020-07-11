//
//  TPKeyboardAvoidingTableView.h
//
//  Created by Michael Tyson on 11/04/2011.
//  Copyright 2011 A Tasty Pixel. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void (^onTouchOutsideWithPoint)(CGPoint where);

@interface TPKeyboardAvoidingTableView : UITableView {
    UIEdgeInsets    _priorInset;
    BOOL            _priorInsetSaved;
    BOOL            _keyboardVisible;
    CGRect          _keyboardRect;
}
@property(nonatomic, copy) onTouchOutsideWithPoint tapped;
@property(nonatomic, assign) BOOL shouldNotRevertToOlderInset;

- (void)adjustOffsetToIdealIfNeeded;
@end
