//
//  QuickSwitchVisibility.h
//  FLUICommons
//
//  Created by Bhargav  on 3/27/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import<UIKit/UIKit.h>
#import "QuickSwitchProtocol.h"

#define DEFAULT_QSM_MENU_BUTTON_DIAMETER 45.0f
#define DEFAULT_QSM_MENU_DIAMETER 200.0f

@interface QuickSwitchVisibility : UIView

typedef NS_ENUM(NSUInteger, QuickSwitchAlignment){
    
    QuickSwitchAlignmentLeft = 0,
    QuickSwitchAlignmentRight = 1,
    QuickSwitchAlignmentHidden = 2
};

@property (nonatomic, assign) QuickSwitchAlignment  alignment;
@property (nonatomic, strong) id <QuickSwitchProtocol> delegate;
@property (nonatomic, assign,getter=isQuickSwichMenuEnabled) BOOL quickSwichMenuEnabled;
@property NSInteger innerCircleDiameter;
@property NSInteger outerCircleDiameter;

+(QuickSwitchVisibility*) getInstance;

-(void)showQuickSwitchMenu;
-(void)hideQuickSwitchMenu;
-(BOOL) isQuickSwitchShowing;

@end
