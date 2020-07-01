//
//  FLCOToolBarConfirmationItemSet.h
//  FLCODragMenu
//
//  Created by Suresh Mudireddy on 18/01/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import "FLCOToolBarItemSet.h"

@interface FLCOToolBarConfirmationItemSet : FLCOToolBarItemSet

@property (nonatomic) SEL confirmAction;

+ (FLCOToolBarConfirmationItemSet *)confirmationBarItemSetWithTarget:(id)target andConfirmAction:(SEL)confirmAction andDismissAction:(SEL)dismissAction;

- (IBAction)confirm:(id)sender;

@end
