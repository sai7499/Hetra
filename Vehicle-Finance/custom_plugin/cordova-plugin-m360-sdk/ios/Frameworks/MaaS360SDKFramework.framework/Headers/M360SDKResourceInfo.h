//
//  M360SDKResourceInfo.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 10/5/15.
//  Copyright © 2015 Fiberlink. All rights reserved.
//

#import "M360SDKBaseClass.h"
#import <Foundation/Foundation.h>
#import "M360SDKConstants.h"

#ifndef M360SDKResourceInfo_h
#define M360SDKResourceInfo_h

/*
 
 This object needs to be created by the sdk app by filling in appropriate details for fetching the encryption key of a resource
 
 */

@interface M360SDKResourceInfo : NSObject<M360SDKBaseClass>

/* 
 
Key uniquely identifying the resource. Key manager uses this property to identify if key is already generated or if new key needs to be generated
*/
@property(nonatomic,strong) NSString *resourceKey;


/*
 
Resource type is meta information about the resource indicating, if it is a database,a file or in memory data. This is field is not used for anything currently , it is primarily for better logging.
 
*/
@property(nonatomic,assign) M360SDKResourceType resourceType;

/*
 
 Data class type is needed for determining what type of encryption key needs to be generated/
 
 M360SDKAppData :  This type of data is protected by key generated from device based salt and is available as long as the application is running and will not need any user input for fetching this key.  Specify this data type for storing app meta information like server config, device specific data.
 
 M360SDKUserData : This type of data is protected by an encryption key derived from user container passcode.  Specify this data type for any data which needs to be protected based on container passcode. Ex: Documents, chat history, mails etc..
 
 M360SDKSharedData : This type of data is protected by  key generated from  device based salt. Key used for encrypting this type of data is same across all the sdk apps. Ex: If data needs to be shared across app-groups or shared via keychain, use this category so that it generates same encryption key in both the apps.
 
 M360SDKSharedUserData : This type of data is protected by encrypted key derived based on container passcode. Key used for encrypting this type of data is same across all the sdk apps. Ex: If user data needs to be shared across app-groups or shared via keychain.
 
 M360SDKIPCData : This is for fetching key needed for Inter process communication. Fetch this key for encrypting data that needs to be sent to other apps via custom URL.
 
 
*/
@property(nonatomic,assign) M360SDKDataClassType dataClassType;

@end


#endif /* M360SDKResourceInfo_h */
