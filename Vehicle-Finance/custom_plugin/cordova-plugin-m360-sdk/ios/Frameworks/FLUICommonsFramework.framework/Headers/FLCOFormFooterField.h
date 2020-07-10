//
//  FLCOFormFooterField.h
//  FLUICommons
//
//  Created by Sachin on 27/05/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface FLCOFormFooterField : NSObject

@property(nonatomic) BOOL isSubmitButton,useDefaultSubmitButton, isBackButton;
@property(nonatomic) float gapBelow,gapAbove;
@property(nonatomic,strong) NSMutableArray *formFieldArrays;
@property(nonatomic,strong) UIView *view; // the size of frame here is important, rest will be centered by the Form controller
//@property(nonatomic) CGRect frame;



@end
