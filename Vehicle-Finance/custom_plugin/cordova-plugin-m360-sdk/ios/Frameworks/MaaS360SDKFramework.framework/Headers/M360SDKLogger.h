//
//  M360SDKLogger.h
//  MaaS360SDK
//
//  Created by Naresh SVS on 17/04/13.
//  Copyright (c) 2013 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "M360SDKBaseClass.h"

#define M360SDK_LOG_FLAG_ERROR    (1 << 0)  // 0...0001
#define M360SDK_LOG_FLAG_WARN     (1 << 1)  // 0...0010
#define M360SDK_LOG_FLAG_INFO     (1 << 2)  // 0...0100
#define M360SDK_LOG_FLAG_VERBOSE  (1 << 3)  // 0...1000
#define M360SDK_LOG_FLAG_DETAIL   (1 << 4)  // 0...10000

#define M360SDK_LOG_LEVEL_OFF     0
#define M360SDK_LOG_LEVEL_ERROR   (M360SDK_LOG_FLAG_ERROR)                                                    // 0...0001
#define M360SDK_LOG_LEVEL_WARN    (M360SDK_LOG_FLAG_ERROR | M360SDK_LOG_FLAG_WARN)                                    // 0...0011
#define M360SDK_LOG_LEVEL_INFO    (M360SDK_LOG_FLAG_ERROR | M360SDK_LOG_FLAG_WARN | M360SDK_LOG_FLAG_INFO)                    // 0...0111
#define M360SDK_LOG_LEVEL_VERBOSE (M360SDK_LOG_FLAG_ERROR | M360SDK_LOG_FLAG_WARN | M360SDK_LOG_FLAG_INFO | M360SDK_LOG_FLAG_VERBOSE) // 0...1111

#define M360SDK_LOG_LEVEL_INFO_DETAIL (M360SDK_LOG_FLAG_ERROR | M360SDK_LOG_FLAG_WARN | M360SDK_LOG_FLAG_INFO | M360SDK_LOG_FLAG_DETAIL) // 0...1111
#define M360SDK_LOG_LEVEL_VERBOSE_DETAIL (M360SDK_LOG_FLAG_ERROR | M360SDK_LOG_FLAG_WARN | M360SDK_LOG_FLAG_INFO | M360SDK_LOG_FLAG_VERBOSE | M360SDK_LOG_FLAG_DETAIL) // 0...1111


#define M360SDK_LOG_ERROR   (m360sdkLogLevel & M360SDK_LOG_FLAG_ERROR)
#define M360SDK_LOG_WARN    (m360sdkLogLevel & M360SDK_LOG_FLAG_WARN)
#define M360SDK_LOG_INFO    (m360sdkLogLevel & M360SDK_LOG_FLAG_INFO)
#define M360SDK_LOG_VERBOSE (m360sdkLogLevel & M360SDK_LOG_FLAG_VERBOSE)
#define M360SDK_LOG_DETAIL  (m360sdkLogLevel & M360SDK_LOG_FLAG_DETAIL)

#define M360SDK_LOG_ASYNC_ENABLED YES

#define M360SDK_LOG_ASYNC_ERROR   (YES && M360SDK_LOG_ASYNC_ENABLED)
#define M360SDK_LOG_ASYNC_WARN    (YES && M360SDK_LOG_ASYNC_ENABLED)
#define M360SDK_LOG_ASYNC_INFO    (YES && M360SDK_LOG_ASYNC_ENABLED)
#define M360SDK_LOG_ASYNC_VERBOSE (YES && M360SDK_LOG_ASYNC_ENABLED)
#define M360SDK_LOG_ASYNC_DETAIL  (YES && M360SDK_LOG_ASYNC_ENABLED)

#define M360SDK_LOG_MACRO(isAsynchronous, lvl, flg, ctx, atag, fnct, frmt, ...) \
[M360SDKLogger log:isAsynchronous                                             \
level:lvl                                                        \
flag:flg                                                        \
context:ctx                                                        \
file:__FILE__                                                   \
function:fnct                                                       \
line:__LINE__                                                   \
tag:atag                                                       \
format:(frmt), ##__VA_ARGS__]

#define M360SDK_LOG_OBJC_MACRO(async, lvl, flg, ctx, frmt, ...) \
M360SDK_LOG_MACRO(async, lvl, flg, ctx, nil, sel_getName(_cmd), frmt, ##__VA_ARGS__)

#define M360SDK_LOG_C_MACRO(async, lvl, flg, ctx, frmt, ...) \
M360SDK_LOG_MACRO(async, lvl, flg, ctx, nil, __FUNCTION__, frmt, ##__VA_ARGS__)

#define M360SDK_LOG_MAYBE(async, lvl, flg, ctx, fnct, frmt, ...) \
do { if(lvl & flg) M360SDK_LOG_MACRO(async, lvl, flg, ctx, nil, fnct, frmt, ##__VA_ARGS__); } while(0)

#define M360SDK_LOG_OBJC_MAYBE(async, lvl, flg, ctx, frmt, ...) \
M360SDK_LOG_MAYBE(async, lvl, flg, ctx, sel_getName(_cmd), frmt, ##__VA_ARGS__)

#define M360SDK_LOG_C_MAYBE(async, lvl, flg, ctx, frmt, ...) \
M360SDK_LOG_MAYBE(async, lvl, flg, ctx, __FUNCTION__, frmt, ##__VA_ARGS__)

#define M360SDKLogError(frmt, ...)      M360SDK_LOG_OBJC_MAYBE(M360SDK_LOG_ASYNC_ERROR,   m360sdkLogLevel, M360SDK_LOG_FLAG_ERROR,   0, frmt, ##__VA_ARGS__)
#define M360SDKLogInfo(frmt, ...)       M360SDK_LOG_OBJC_MAYBE(M360SDK_LOG_ASYNC_INFO,    m360sdkLogLevel, M360SDK_LOG_FLAG_INFO,    0, frmt, ##__VA_ARGS__)
#define M360SDKLogWarn(frmt, ...)       M360SDK_LOG_OBJC_MAYBE(M360SDK_LOG_ASYNC_WARN,    m360sdkLogLevel, M360SDK_LOG_FLAG_WARN,    0, frmt, ##__VA_ARGS__)
#define M360SDKLogVerbose(frmt, ...)    M360SDK_LOG_OBJC_MAYBE(M360SDK_LOG_ASYNC_VERBOSE, m360sdkLogLevel, M360SDK_LOG_FLAG_VERBOSE, 0, frmt, ##__VA_ARGS__)
#define M360SDKLogDetail(frmt, ...)     M360SDK_LOG_OBJC_MAYBE(M360SDK_LOG_ASYNC_DETAIL,  m360sdkLogLevel, M360SDK_LOG_FLAG_DETAIL,  0, frmt, ##__VA_ARGS__)

#define M360SDKLogCError(frmt, ...)     M360SDK_LOG_C_MAYBE(M360SDK_LOG_ASYNC_ERROR,   m360sdkLogLevel, M360SDK_LOG_FLAG_ERROR,   0, frmt, ##__VA_ARGS__)
#define M360SDKLogCInfo(frmt, ...)      M360SDK_LOG_C_MAYBE(M360SDK_LOG_ASYNC_INFO,    m360sdkLogLevel, M360SDK_LOG_FLAG_INFO,    0, frmt, ##__VA_ARGS__)
#define M360SDKLogCWarn(frmt, ...)      M360SDK_LOG_C_MAYBE(M360SDK_LOG_ASYNC_WARN,    m360sdkLogLevel, M360SDK_LOG_FLAG_WARN,    0, frmt, ##__VA_ARGS__)
#define M360SDKLogCVerbose(frmt, ...)   M360SDK_LOG_C_MAYBE(M360SDK_LOG_ASYNC_VERBOSE, m360sdkLogLevel, M360SDK_LOG_FLAG_VERBOSE, 0, frmt, ##__VA_ARGS__)
#define M360SDKLogCDetail(frmt, ...)    M360SDK_LOG_C_MAYBE(M360SDK_LOG_ASYNC_DETAIL,  m360sdkLogLevel, M360SDK_LOG_FLAG_DETAIL,  0, frmt, ##__VA_ARGS__)

@class FLCODDLog;

extern int m360sdkLogLevel;

@class FLCODDFileLogger;

@interface M360SDKLogger : NSObject<M360SDKBaseClass>
{

@private
    FLCODDFileLogger* _fileLogger;

}

+ (void)log:(BOOL)synchronous
      level:(int)level
       flag:(int)flag
    context:(int)context
       file:(const char *)file
   function:(const char *)function
       line:(int)line
        tag:(id)tag
     format:(NSString *)format, ... __attribute__ ((format (__NSString__, 9, 10)));



- (NSArray *)loggedFilePaths;
- (void) initiateFileLogging;
- (void) updateFileLoggerLevel:(int) logLevel;
- (void) clearLoggedFilePaths;


+ (M360SDKLogger *) getInstance;
- (NSString *)logsDirectory;

@end
