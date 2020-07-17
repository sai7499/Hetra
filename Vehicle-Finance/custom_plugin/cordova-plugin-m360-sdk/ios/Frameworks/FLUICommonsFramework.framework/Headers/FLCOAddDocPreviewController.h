//
//  FLMCAddDocPreviewController.h
//  MaaS360
//
//  Created by Swaroop Mahajan on 10/09/15.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@class FLCOAddDocPreviewController;

@protocol FLCOAddDocPreviewDelegate <NSObject>

-(void)previewController:(FLCOAddDocPreviewController*)controller didChooseMedia:(NSDictionary*)fileItem;

@end

@interface FLCOAddDocPreviewController : UIViewController

@property(nonatomic,weak) id<FLCOAddDocPreviewDelegate> delegate;

-(instancetype)initWithPreviewItem:(NSDictionary*)previewItem;

@end
