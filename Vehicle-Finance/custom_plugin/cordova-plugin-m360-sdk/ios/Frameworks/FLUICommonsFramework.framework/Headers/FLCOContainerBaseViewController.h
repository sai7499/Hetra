//
//  FLCOContainerBaseViewController.h
//  FLUICommons
//
//  Created by Bhargav  on 30/03/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FLCOContainerBaseViewController : UIViewController

-(void)setAllRemoteNotificationContext:(NSDictionary *)context;
- (NSDictionary *)getAllRemoteNotificationContext;
-(void)setAllLocalNotificationContext:(NSDictionary *)context;
- (NSDictionary *)getAllLocalNotificationContext;

@end
