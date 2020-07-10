//
//  FLCOTextViewCell.h
//  FLUICommons
//
//  Created by Vivek Murali on 6/2/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOPlaceholderTextView.h"

@class FLCOTextViewCell;

@protocol FLCOTextViewCellDelegate <NSObject>

@optional
- (void)textViewCellDidBeginEditing:(FLCOTextViewCell *)textViewCell;
- (void)textViewCellDidEndEditing:(FLCOTextViewCell *)textViewCell;
- (void)textViewCell:(FLCOTextViewCell *)textViewCell changedTextViewText:(NSString *)textViewText;

@end

@interface FLCOTextViewCell : UITableViewCell

//Use cell.tag to identify which cell is calling the delegate method
@property (weak, nonatomic) id <FLCOTextViewCellDelegate> delegate;

- (BOOL)textViewEditable;
- (NSString *)textViewText;
- (NSString *)textViewPlaceholderText;
- (UIColor *)textViewPlaceholderColor;

//It is better to set all the values below to avoid issues due to dequeueing of cells
- (void)setTextViewEditable:(BOOL)editable;
- (void)setTextViewText:(NSString *)textViewText;
- (void)setTextViewPlaceholderText:(NSString *)placeholderText;
- (void)setTextViewPlaceholderColor:(UIColor *)placeholderColor;

@end
