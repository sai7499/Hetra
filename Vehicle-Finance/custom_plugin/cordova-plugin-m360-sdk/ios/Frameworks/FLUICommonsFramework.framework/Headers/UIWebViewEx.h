//
//  UIWebViewEx.h
//  MaaS360
//
//  Created by Suresh Mudireddy on 24/05/12.
//  Copyright 2011 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIWebView.h>
#import <Foundation/Foundation.h>


@protocol FLUIWebViewCopyPasteDelegate <NSObject>

-(void)handleCopyEvent:(id)sender;
@optional
-(void)handlePasteEvent:(id)sender;

@end

@protocol UIWebViewExDelegate <NSObject>

@optional

-(void) webviewDidLoadResource:(id)resource dataSource:(id)dataSource;

@end

@interface UIWebViewEx : UIWebView {

    BOOL _copyCutAndPasteEnabled;
}

@property (nonatomic) BOOL copyCutAndPasteEnabled;
@property (nonatomic, assign) BOOL isComposeView;
@property (nonatomic,weak)id<FLUIWebViewCopyPasteDelegate> theCopyPasteDelegate;
@property (nonatomic)NSInteger numberOfFailureAttemts;
@property (nonatomic, weak)id<UIWebViewExDelegate> resourceLoadDelegate;

-(void)__removeShareOption;

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender;

- (NSInteger)highlightAllOccurencesOfString:(NSString*)str;
- (void)removeAllHighlights;
- (NSString *)selectedText;

@end
