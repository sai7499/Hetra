//
//  FLCOOpenLinkActionSheet.h
//  commons
//
//  Created by Prasad Pallela on 8/3/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface FLCOOpenLinkActionSheet : NSObject<UIActionSheetDelegate>

+(void) showChoiceMenu:(NSString *) url AtRect:(CGRect)rect senderView:(UIView*)senderView viewController:(UIViewController*)VC withCompletionBlock:(void (^)())completionBlock;


@end
