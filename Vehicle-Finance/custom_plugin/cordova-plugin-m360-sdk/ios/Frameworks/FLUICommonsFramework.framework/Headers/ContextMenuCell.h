//
//  YALSideMenuCell.h
//  YALMenuAnimation
//
//  Created by Maksym Lazebnyi on 1/12/15.
//  Copyright (c) 2015 Yalantis. All rights reserved.
//


#import <UIKit/UIKit.h>

#import "YALContextMenuCell.h"

@protocol YALMenuSelectDelegate <NSObject>

@optional
-(void)didSelectMenuIcon:(NSIndexPath*)indexPath withTag:(NSInteger)tag;

@end

@interface ContextMenuCell : UITableViewCell <YALContextMenuCell>

@property(weak) id<YALMenuSelectDelegate> delegate;
@property(nonatomic,strong)NSIndexPath *indexPath;
@property (strong, nonatomic) IBOutlet UIImageView *menuImageView;
//@property (strong, nonatomic) IBOutlet UILabel *menuTitleLabel;

@property(strong,nonatomic)IBOutlet UIImageView *menuImageView1;

-(void)tapImageView:(id)sender;
-(void)tapImageView1:(id)sender;

@end
