//
//  M360SDKKeyManager.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 10/5/15.
//  Copyright © 2015 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "M360SDKConstants.h"
#import "M360SDKKeyInfo.h"
#import "M360SDKResourceInfo.h"
#import "M360SDKBaseClass.h"


typedef void (^M360SDKKeyEventHandler) (M360SDKKeyEventType eventType, M360SDKKeyInfo *keyInfo);


/*
 
 This is the primary class for accessing SDK Keystore. Has functions for generating keys and deleting keys from keystore.
 
 */

@interface M360SDKKeyManager : NSObject <M360SDKBaseClass>

/*

 Class method for accessing M360SDKKeyManager Instance.
 
 Sample code accessing key manager
 
 M360SDKResourceInfo *resInfo = [[M360SDKResourceInfo alloc] init];
 resInfo.resourceKey = @"SampleDatabse.db";
 resInfo.resourceType = M360SDKdb;
 resInfo.dataClassType = M360SDKUserData;
 
 //set the key explicitly if we know key is already available
 M360SDKKeyInfo *keyInfo = [[M360SDKKeyManager shared] fetchKeyForResource:resInfo.resourceKey];
 NSData *encryptionKey = [keyInfo getEncryptionKey];
 if(keyInfo != nil && encryptionKey != nil)
 {
    //open database with encryption key
 }
 else
 {
    [[M360SDKKeyManager shared] manageResourcewithInfo:resInfo withEventHandler:^(CRKeyEventType eventType, FLCRKeyInfo *keyInfo) {
 
    switch (eventType) {
        case M360SDKKeyAvailable:
        {
            //open database with encryption key
        }
        break;
        case M360SDKKeyUnvailable:
        {
            //close database with encryption key
        }
        break;
        case M360SDKKeyDestroyed:
        {
            //Delete database and request for new key
        }
        default:
        break;
        }
    }];
 
}
 
 */
+(M360SDKKeyManager *) shared;


/*
 Pass details of the resource which needs to be managed by the SDK Keystore, along with the an eventHandler which sdk calls whenever a key is generated or available for use.
 
 M360SDKKeyEventHandler primarily has 2 inputs,
    -> M360SDKKeyEventType
 
        M360SDKKeyAvailable: This event indicates encryption key is available for the resource and can be used for decrypting the data. Call to manageResource function may not immediately return the key needed, since sometimes user might have to enter pin before the key is generated. So All code needed for decrypting and opening the resource needs to be invoked on M360SDKKeyAvailable event
 
        M360SDKKeyUnvailable: This event is called whenever sdk has initially had access to the key and now it lost access to the encryption key. This scenario can happen if time for caching the encryption key expires or pin time out expires. SDK app on recieving this event should close the resource since it cannot be decrypted further.
 
 
        M360SDKKeyDestroyed:  This event is called if sdk can never recover the encryption key. In this case SDK app has to delete the resource and request for a new key.
 
 
    -> M360SDKKeyInfo : Key Info object which has the encryption key.
 
 */
-(void) manageResourcewithInfo:(M360SDKResourceInfo *) resourceInfo withEventHandler:(M360SDKKeyEventHandler) eventHandler;

/*
 
 This function deletes encryption keys associated with the resource.
 
 */

-(void) unmanageResourceWithResourceKey:(NSString *) resourceKey;

/*
 
 Returns KeyInfo if there is anything available for the resource, otherwise returns nil.
 
 */
-(M360SDKKeyInfo *) fetchKeyForResource:(NSString *) resourceKey;

/*
 
 Returns true if Maas app can provide secure key to shared data, else will retrun false.
 
 */

-(BOOL) canShareDataUsingSecureKey;

/*
 
 Returns true if SDK is ready to provided secured keys for all resources, else will return false
 
 */

-(BOOL) canUseSecureKeys;


//#ifdef DEBUG
/* QA Testing method. Donot forget to remove this from the final build */

-(NSMutableDictionary *)getAllKeys;
//#endif

@end
