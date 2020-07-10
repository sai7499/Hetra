//
//  M360SDKDocumentInteractionController.h
//  MaaS360SDK
//
//  Created by Karthik Ramgopal on 29/04/13.
//  Copyright (c) 2013 Fiberlink. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "M360SDKBaseClass.h"

//
// Extension to the iOS SDK class UIDocumentInteractionController, with the added functionality of
// allowing open In.. only in the list of whitelisted apps. For other apps, attempting to open
// results in failure with an error message being displayed to the user.
//
// If the whitelisted apps list is empty or nil, then no app is allowed to open any document.
//
@interface M360SDKDocumentInteractionController : UIDocumentInteractionController<UIDocumentInteractionControllerDelegate,M360SDKBaseClass>

+ (UIDocumentInteractionController *)interactionControllerWithURL:(NSURL *)url;

@end
