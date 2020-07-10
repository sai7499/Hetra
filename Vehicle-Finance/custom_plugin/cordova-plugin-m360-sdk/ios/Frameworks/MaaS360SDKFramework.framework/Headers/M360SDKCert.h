//
//  M360SDKCert.h
//  MaaS360SDKFramework
//
//  Created by Srikar Nagavaram on 06/02/19.
//  Copyright © 2019 Fiberlink. All rights reserved.
//

@interface M360SDKCert : NSObject


-(id) initWithData:(NSData *)data andPassword:(NSString *)password;

-(NSData*)getData;

-(NSString*)getPassword;

@end

