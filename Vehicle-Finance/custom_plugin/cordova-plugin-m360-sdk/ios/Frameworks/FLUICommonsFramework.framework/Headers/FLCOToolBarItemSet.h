//
//  FLCOToolBarItemSet.h
//  FLCODragMenu
//
//  Created by Suresh Mudireddy on 18/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FLCOCustomTabBarItem.h"
#import "FLCOGenericUtils.h"

typedef void(^FLCOToolBarBarItemActionHandler)(id tabBarItem);

@interface FLCOToolBarItemSet : NSObject

@property (nonatomic, strong) NSArray *toolBarItems;
@property (nonatomic, strong) NSArray *tabBarItems;
@property (nonatomic, assign) NSUInteger selectedTabBarIndex;
@property (nonatomic, strong) NSArray *menuListItems;
@property (nonatomic, weak) id dismissTarget;
@property (nonatomic) SEL dismissAction;
@property (nonatomic, copy)  FLCOToolBarBarItemActionHandler tabBarItemActionHandler;

- (FLCOToolBarItemSet *)initWithItems:(NSArray *)barItems;
- (IBAction)dismiss:(id)sender;

@end
