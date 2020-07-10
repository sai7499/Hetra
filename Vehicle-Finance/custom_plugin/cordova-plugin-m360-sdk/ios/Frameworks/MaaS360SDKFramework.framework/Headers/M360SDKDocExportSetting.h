//
//  M360SDKDocExportSetting.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 27/05/14.
//  Copyright (c) 2014 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface M360SDKDocExportSetting : NSObject

// Indicates if restrict export is enabled or not
@property(nonatomic,assign) BOOL restrictExport;

//Indicates list of allowed apps if restrict export is enabled
@property(nonatomic,strong) NSMutableArray *allowedApps;

//Indicates list of allowed doc types if restrict export is enabled
@property(nonatomic,strong) NSMutableArray *allowedDocTypes;

@end

