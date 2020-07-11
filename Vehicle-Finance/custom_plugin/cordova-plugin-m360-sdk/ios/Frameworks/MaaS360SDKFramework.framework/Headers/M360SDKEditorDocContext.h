//
//  M360SDKEditorDocContext.h
//  MaaS360SDK
//
//  Created by Vinay Raja on 19/11/13.
//  Copyright (c) 2013 Fiberlink. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>
#import "M360SDKEditorDocInteractionProtocol.h"



@interface M360SDKEditorDocContext : NSObject

// Will be generated and used by MaaS360 SDK
//@property(nonatomic,assign) int Id;

// Application File Id
@property(nonatomic,strong) NSString *fileId;

//File Display name
@property(nonatomic,strong) NSString *fileDisplayName;

//File Path (including file name)
@property(nonatomic,strong) NSString *filePath;

//Current version of document
@property(nonatomic,strong) NSString *fileVersion;

// Assuming every module will be unique
@property(nonatomic,strong) NSString *module;

// mime type being added for future use
@property(nonatomic,strong) NSString *mimeType;

//Encryption key if required
@property(nonatomic,strong) NSString *encryptionKey;

// Application Bundle Id to be used by MaaS360 SDK
@property(nonatomic,strong) NSString *applicationId;

// Application Name
@property(nonatomic,strong) NSString *applicationName;

// Last modified date
@property(nonatomic,strong) NSDate *lastModified;

// Additional Info (For future use)
@property(nonatomic,strong) NSDictionary *additionalInfo;

//presentation delegate , relevant in the calling app only
@property(nonatomic,weak) id<M360SDKEdiorDocInteractionControlPresenterProtocol> presentationDelegate;

@property(nonatomic,strong) NSString *communicationWay;

@property(nonatomic,strong) NSDictionary *agentEncryptionInfo;


//@property (nonatomic) CGRect docInteractionRect;

//@property (nonatomic) UIBarButtonItem *docInteractionBarButtonAnchor;

//@property(nonatomic) BOOL docIRInitialized;

//@property(nonatomic, strong) NSNumber *fileSize;


// FOR SDK
@property(nonatomic,assign) int isDeleted;

/*
 Should be used by the application to create docContext to :
 1. Send a document for editing
 */
- (id) initWithFileId:(NSString *) fileId
   andFileDisplayName:(NSString *) fileDisplayName
          andFilePath:(NSString *) filePath
       andFileVersion:(NSString *) fileVersion
            andModule:(NSString *) module
          andMimeType:(NSString *) mimeType
     andEncryptionKey:(NSString *) encryptionKey
  andLastModifiedDate:(NSDate *) lastModifiedDate
    andAdditionalInfo:(NSDictionary *) additionalInfo;

@end

