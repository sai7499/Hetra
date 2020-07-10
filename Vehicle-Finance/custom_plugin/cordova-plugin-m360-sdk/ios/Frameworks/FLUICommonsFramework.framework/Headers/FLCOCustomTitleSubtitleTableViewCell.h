//
//  FLCOCustomTitleSubtitleTableViewCell.h
//  FLUICommons
//
//  Created by Apoorv on 3/9/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOCustomTitleSubtitleTableViewCell : UITableViewCell

@property (weak, nonatomic) IBOutlet UIImageView *customCellImageView;
@property (weak, nonatomic) IBOutlet UILabel *customCellTitle;
@property (weak, nonatomic) IBOutlet UILabel *customCellSubtitle;
@property (weak, nonatomic) IBOutlet NSLayoutConstraint *imageVIewWidth;

@end
