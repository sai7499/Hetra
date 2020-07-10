//
//  FLCOSubtitleTableViewCell.h
//  FLUICommons
//
//  Created by Vivek Murali on 1/28/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOGenericUtils.h"
@interface FLCOSubtitleTableViewCell : UITableViewCell

- (void)setTitleText:(NSString *)titleText;
- (void)setSubtitleText:(NSString *)subtitleText;

- (void)setNumberOfLinesForTitleLabel:(NSInteger)numberOfLinesForTitleLabel;
- (void)setNumberOfLinesForSubtitleLabel:(NSInteger)numberOfLinesForSubtitleLabel;

@end
