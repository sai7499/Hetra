//
//  QuickSwitchProtocol.h
//  FLUICommons
//
//  Created by Bhargav  on 3/27/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#ifndef FLUICommons_QuickSwitchProtocol_h
#define FLUICommons_QuickSwitchProtocol_h

#endif

@protocol QuickSwitchProtocol <NSObject>

-(NSMutableArray *)getQuickSwitchConfig;
-(void)containerSelected:(NSDictionary *)selectedContinerInfo;
-(CGFloat)getinnerCircleDiameter;
-(CGFloat)getouterCircleDiameter;
-(BOOL)isQuickSwitchMenuRelevent;

-(BOOL)isContainerLockEnabled;
-(void)LockContainer;

@end

@protocol QuickSwitchSelectionProtocol <NSObject>
- (void)buttonPressedAtIndex:(NSInteger)index;
@end

