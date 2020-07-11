//
//  ErrorModel.h
//  core
//
//  Created by Naresh SVS on 19/08/12.
//
//

#import <Foundation/Foundation.h>

@interface FLCOErrorModel : NSObject
{
    NSString* _errorCode;
    NSString* _errorString;
}

@property(nonatomic, strong) NSString* errorCode;
@property(nonatomic, strong) NSString* errorString;

@end
