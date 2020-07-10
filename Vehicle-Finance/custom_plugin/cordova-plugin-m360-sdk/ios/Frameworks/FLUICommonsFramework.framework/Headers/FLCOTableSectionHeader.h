//
//  FLCOTableSectionHeader.h
//  FLUICommons
//
//  Created by Vivek Murali on 10/27/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCODateUtils.h"

#define DEFAULT_SECTION_HEADER_HEIGHT   32.0f

@interface FLCOTableSectionHeader : UIView

@property(nonatomic, assign) BOOL useDefaultHeaderImage;

- (instancetype)initWithFrame:(CGRect)frame date:(NSDate *)date leftMargin:(NSUInteger)leftMargin rightMargin:(NSUInteger)rightMargin;

- (instancetype)initWithFrame:(CGRect)frame leftText:(NSString *)leftText rightText:(NSString *)rightText leftMargin:(NSUInteger)leftMargin rightMargin:(NSUInteger)rightMargin;

//This is to show the date string on left side with margin.
- (instancetype)initWithFrame:(CGRect)frame showDateStringOnLeftForDate:(NSDate *)date dateFormat:(NSString*)format leftMargin:(NSUInteger)leftMargin;

@end
