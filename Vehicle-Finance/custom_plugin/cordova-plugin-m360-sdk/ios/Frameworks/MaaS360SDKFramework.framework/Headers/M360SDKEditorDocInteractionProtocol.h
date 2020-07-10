//
//  M360SDKEditorDocInteractionProtocol.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 16/01/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import "FLCREditorDocInteractionControlPresenterProtocol.h"


@protocol M360SDKEdiorDocInteractionControlPresenterProtocol 
-(void) presentTheDocInteractionController:(UIDocumentInteractionController *) docInteractionController;
-(void) dismissedTheDocInteractionController:(UIDocumentInteractionController *) docInteractionController;

@end
