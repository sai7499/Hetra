//
//  FLCODatePickerCell.h
//  FLUICommons
//
//  Created by Vivek Murali on 5/29/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCODatePickerCell;

@protocol FLCODatePickerCellDelegate <NSObject>

- (void)datePickerCell:(FLCODatePickerCell *)datePickerCell didPickDate:(NSDate *)date;

@end

@interface FLCODatePickerCell : UITableViewCell

//Use cell.tag to identify which cell is calling the delegate method
@property (weak, nonatomic) id <FLCODatePickerCellDelegate> delegate;

- (NSDate *)date;
- (NSDate *)minimumDate;
- (NSInteger)minuteInterval;
- (UIDatePickerMode *)datePickerMode;

//It is better to set all the values below to avoid issues due to dequeueing of cells
- (void)setDate:(NSDate *)date;
- (void)setMinimumDate:(NSDate *)minimumDate;
- (void)setMinuteInterval:(NSInteger)minuteInterval;
- (void)setDatePickerMode:(UIDatePickerMode)datePickerMode;

@end
