//
//  DZNPhotoPickerControllerConstants.h
//  DZNPhotoPickerController
//  https://github.com/dzenbot/DZNPhotoPickerController
//
//  Created by Ignacio Romero Zurbuchen on 10/5/13.
//  Copyright (c) 2014 DZN Labs. All rights reserved.
//  Licence: MIT-Licence
//

extern NSString *const DZNPhotoPickerControllerCropMode;              // An NSString (i.e. square, circular)
extern NSString *const DZNPhotoPickerControllerCropZoomScale;         // An NSString (from 1.0 to maximum zoom scale, 2.0f)
extern NSString *const DZNPhotoPickerControllerPhotoMetadata;         // An NSDictionary containing metadata from a captured photo

extern NSString *const DZNPhotoPickerDidFinishPickingNotification;    // The notification key used when picking a photo finished.
extern NSString *const DZNPhotoPickerDidFailPickingNotification;      // The notification key used when picking a photo failed.

/**
 Types of supported crop modes.
 */
typedef NS_ENUM(NSInteger, DZNPhotoEditorViewControllerCropMode) {
    DZNPhotoEditorViewControllerCropModeNone = 0,
    DZNPhotoEditorViewControllerCropModeSquare,
    DZNPhotoEditorViewControllerCropModeCircular,
    DZNPhotoEditorViewControllerCropModeCustom
};
