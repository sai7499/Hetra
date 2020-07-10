//
//  FLCOAppFeatureDetails.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 09/04/15.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface FLCOAppFeatureDetails : NSObject

@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *subTitle;
@property (nonatomic, strong) NSString *details;
@property (nonatomic, strong) UIImage  *iconImage;
@property (nonatomic, strong) NSString *containerCode;
@property (nonatomic, strong) NSString *featureCode;
@property (nonatomic, strong) NSString *addedInAgentOfVersion;

@property (nonatomic) BOOL isCustomActionCell;
@property (nonatomic, strong) NSString *noteDesciption;
@property (nonatomic, strong) NSString *leftButtonTitle;
@property (nonatomic, strong) NSString *rightButtonTitle;
@property (nonatomic, strong) NSString *noteSubTitle;

-(instancetype)initWithDictionary:(NSDictionary*)featureDetails;

@end
