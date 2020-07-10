//
//  FLCOUIGroupAction.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 29/08/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import "FLCOUIAction.h"

@interface FLCOUIGroupAction : FLCOUIAction

@property (nonatomic, strong, readonly) NSArray *actions;
@property (nonatomic, strong) FLCOUIAction *selectedAction;

+ (instancetype)actionWithStyle:(FLCOUIActionStyle)style andActions:(NSArray *)actions;

@end
