//
//  MaaS360NavigationController.h
//
//  Created by Naveen Murthy on 12/6/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ContainerViewControllerProtocol.h"

#define TITLE_VIEW_TAG 22

@protocol FLCOBaseNavigationControllerProtocol <NSObject>

@optional
-(UIViewController *)getNavigationSlideDrawViewController;

-(void)willShowSliderView;
-(void)willHideSliderView;

-(void)willShowMainView;
-(void)willHideMainView;

@end


@interface FLCOBaseNavigationController : UINavigationController
{
}

@property (nonatomic,weak) id<FLCOBaseNavigationControllerProtocol> sliderViewDelegate;

@property (nonatomic,weak) id<ContainerViewControllerProtocol> containerViewDelegate;

@property (nonatomic,assign) BOOL shouldHideArrow;
@property (nonatomic, strong) NSString *oldTitle;

-(void)updateTitle:(NSString *)title andPrompt: (NSString *)promptText;

-(void)updateBackViewTitle:(NSString *)title andPrompt: (NSString *)promptText;

-(void)addMaskingView;

-(void)removeMaskView;

-(BOOL) isShowingSliderView;

-(void)hideSliderView;

-(UINavigationController *)getTopNavigationController;
-(UINavigationController *)getBackNavigationController;

-(void)willHideSliderView;
-(void)willShowSliderView;

-(void)willHideMainView;
-(void)willShowMainView;

-(void)hideSliderViewWithCompletion:(void (^__nullable)(void))completion;


@end