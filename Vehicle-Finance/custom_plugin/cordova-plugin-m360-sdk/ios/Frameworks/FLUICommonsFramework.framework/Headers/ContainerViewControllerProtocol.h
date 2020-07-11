//
//  ContainerViewControllerProtocol.h
//  NaviagationBarSlider
//
//  Created by Naveen Murthy on 3/2/15.
//  Copyright (c) 2015 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol ContainerViewControllerProtocol <NSObject>

- (void)swapViewControllers;
- (void)hideBackViewController;
- (UINavigationController *)getTopNavigationController;
- (UINavigationController *)getBackNavigationController;
@end


@protocol ContainerViewControllerNavigationControllerProtocol <NSObject>

-(void)setContainerDelegate:(id<ContainerViewControllerProtocol>)container;

@end

