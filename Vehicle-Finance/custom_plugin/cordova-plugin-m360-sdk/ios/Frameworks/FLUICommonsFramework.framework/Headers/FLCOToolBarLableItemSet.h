//
//  FLCOToolBarLableItemSet.h
//  FLCODragMenu
//
//  Created by Suresh Mudireddy on 18/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "FLCOToolBarItemSet.h"

@interface FLCOToolBarLableItemSet : FLCOToolBarItemSet

@property (nonatomic, strong, readonly) UILabel *textLabel;
@property (nonatomic, strong, readonly) UILabel *detailTextLabel;

- (FLCOToolBarLableItemSet *)initWithItems:(NSArray *)barItems;
+ (FLCOToolBarLableItemSet *)labelBarItemSet;
+ (FLCOToolBarLableItemSet *)labelBarItemSetWithDismissTarget:(id)target andAction:(SEL)action;

@end
