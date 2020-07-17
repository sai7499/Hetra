//
//  M360SDKPrintInteractionController.h
//  MaaS360SDK
//
//  Created by Bikramjeet Singh on 01/03/16.
//  Copyright © 2016 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface M360SDKPrintInteractionController : NSObject

+ (BOOL)isPrintingAvailable;

+ (NSSet *)printableUTIs;
+ (BOOL)canPrintURL:(NSURL *)url;
+ (BOOL)canPrintData:(NSData *)data;

+ (M360SDKPrintInteractionController *)sharedPrintController;

@property(nullable,nonatomic,strong) UIPrintInfo                             *printInfo;
@property(nullable,nonatomic,weak)   id<UIPrintInteractionControllerDelegate> delegate;
@property(nonatomic)        BOOL                                     showsPageRange;
@property(nonatomic)        BOOL                                     showsNumberOfCopies;
@property(nonatomic)        BOOL                                     showsPaperSelectionForLoadedPapers;

@property(nullable, nonatomic,readonly) UIPrintPaper *printPaper;

@property(nullable,nonatomic,strong) UIPrintPageRenderer *printPageRenderer;
@property(nullable,nonatomic,strong) UIPrintFormatter    *printFormatter;
@property(nullable,nonatomic,copy)   id                   printingItem;
@property(nullable,nonatomic,copy)   NSArray             *printingItems;

- (BOOL)presentAnimated:(BOOL)animated completionHandler:(nullable UIPrintInteractionCompletionHandler)completion;
- (BOOL)presentFromRect:(CGRect)rect inView:(UIView *)view animated:(BOOL)animated completionHandler:(nullable UIPrintInteractionCompletionHandler)completion;
- (BOOL)presentFromBarButtonItem:(UIBarButtonItem *)item animated:(BOOL)animated completionHandler:(nullable UIPrintInteractionCompletionHandler)completion;

- (BOOL)printToPrinter:(UIPrinter *)printer completionHandler:(nullable UIPrintInteractionCompletionHandler)completion;

- (void)dismissAnimated:(BOOL)animated;

@end

NS_ASSUME_NONNULL_END

