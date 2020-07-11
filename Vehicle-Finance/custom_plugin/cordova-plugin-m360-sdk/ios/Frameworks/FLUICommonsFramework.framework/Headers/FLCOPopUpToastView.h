//
//  FLCOPopUpToastView.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 10/03/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

#define PaddingInErrorPopUp 5
#define DefaultColorToastPopUpBg [UIColor colorWithRed:0.702 green:0.000 blue:0.000 alpha:1.000]

@interface FLCOPopUpToastView : UIView

@property (nonatomic,copy)    NSString *strMsg;
@property (nonatomic, strong) UIColor   *popUpColor;
@property (nonatomic, assign) CGRect    showOnRect;
@property (nonatomic, assign) NSInteger popWidth;
@property (nonatomic, assign) CGRect    fieldFrame;


@end
