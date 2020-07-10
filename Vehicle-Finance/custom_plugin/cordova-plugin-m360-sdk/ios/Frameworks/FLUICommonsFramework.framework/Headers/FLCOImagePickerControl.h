//
//  FLCOImagePickerControl.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 05/12/14.
//  Copyright (c) 2014 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>


#define IMAGE_PICKER_FILENAME   @"FileName"
#define IMAGE_PICKER_FILEPATH   @"FilePath"
#define IMAGE_PICKER_ENCKEY     @"EncKey"

typedef NS_ENUM(NSUInteger, FLCOImagePickerType) {
 
    FLCOImagePickerPhoto,
    FLCOImagePickerAlbum
};

@class FLCOImagePickerControl;

@protocol FLCOImagePickerControlDelegate <NSObject>

- (void)imagePickerControl:(FLCOImagePickerControl*)pickerControl didFinishPickingWithInfo:(NSDictionary *)info;

- (void)didCancelImagePickerControl:(FLCOImagePickerControl *)pickerControl;

@end

@interface FLCOImagePickerControl : NSObject <UIImagePickerControllerDelegate,
UINavigationControllerDelegate>

@property (nonatomic, strong) UIImagePickerController  *picker;
@property (nonatomic, weak) id<FLCOImagePickerControlDelegate>delegate;
@property (nonatomic, readonly) FLCOImagePickerType type;

+ (BOOL) isCameraAvailable;
+ (BOOL) isPhotoAlbumAccessible;

+ (instancetype)initControllerWithType:(FLCOImagePickerType)type;

- (void) presentFromController:(UIViewController *)parentController;
- (void) closeController;

@end
