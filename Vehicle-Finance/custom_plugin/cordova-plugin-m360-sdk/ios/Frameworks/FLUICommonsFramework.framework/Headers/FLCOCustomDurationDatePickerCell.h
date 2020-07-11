//
//  FLCOCustomDurationDatePickerCell.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 18/08/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOCustomDurationDatePickerCell : UITableViewCell

@property (nonatomic, readonly) UIDatePicker *datePicker;
@property (strong, nonatomic) NSString *durationPickerTitle;
@property (strong, nonatomic) NSString *durationPickersubTitle;
@property (readonly, nonatomic) NSArray  *durationActions;
@property (strong, nonatomic) NSDate *durationPickerBaseTime;
@property (strong, nonatomic) NSDate *pickerSelectedTime;


- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier withDurationActions:(NSArray*)actions;


@end
