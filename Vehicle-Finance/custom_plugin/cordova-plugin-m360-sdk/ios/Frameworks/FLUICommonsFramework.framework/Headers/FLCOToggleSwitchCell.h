//
//  FLCOToggleSwitchCell.h
//  FLUICommons
//
//  Created by Vivek Murali on 6/4/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCOToggleSwitchCell;

@protocol FLCOToggleSwitchCellDelegate <NSObject>

- (void)toggleSwitchCell:(FLCOToggleSwitchCell *)toggleSwitchCell switchChangedToOn:(BOOL)on;

@end

@interface FLCOToggleSwitchCell : UITableViewCell

@property (weak, nonatomic) id <FLCOToggleSwitchCellDelegate> delegate;

@property (strong, nonatomic) NSString *actionIdentifier;

- (void)setLabelText:(NSString *)labelText;

- (void)setToggleSwitchEnabled:(BOOL)enabled;
- (void)setToggleSwitchOn:(BOOL)on animated:(BOOL)animated;

@end
