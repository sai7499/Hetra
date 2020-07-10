//
//  FLCOQuickSwitchTableView.h
//  FLUICommons
//
//  Created by Apoorv on 6/25/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "QuickSwitchProtocol.h"
#import "ContextMenuCell.h"

#define kRowHeight 44

typedef NS_ENUM(NSUInteger, SwitchAlignment)
{
    SwitchAlignmentLeft = 0,
    SwitchAlignmentRight = 1
};

@interface FLCOQuickSwitchTableView : UIControl<YALMenuSelectDelegate>

@property (weak) id <QuickSwitchSelectionProtocol> delegate;

@property(nonatomic,strong)UIImage *closeImage;

@property CGFloat switchButtonPositionY;

@property SwitchAlignment alignment;

- (id) initWithFrame:(CGRect)frame withIcons:(NSMutableArray*)icons;

-(void)showQuickSwitchViewIn:(UIView*)view;

-(void)quickViewLayoutSetupNew;

-(void)quickViewLayoutSetupSingleColumn;

@end
