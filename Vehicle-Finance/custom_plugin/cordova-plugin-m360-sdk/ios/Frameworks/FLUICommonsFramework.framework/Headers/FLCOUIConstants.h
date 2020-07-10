//
//  CRUIConstants.h
//  core
//
//  Created by Naresh SVS on 01/09/12.
//
//

#import <Foundation/Foundation.h>

extern NSString * const EULA_CONTROLLER_NIB;
extern NSString * const DEVICE_CUSTOM_ATTRIB_NIB;
extern NSString * const kNotifyUpdateSplitViewManagerKeys;
extern NSString * const kSplitViewControllerKey;

extern NSString * const APP_THEME_COLOR_KEY;

extern NSString * const SETTINGS_ROW_PIN;
extern NSString * const SETTINGS_ROW_MAIL;
extern NSString * const SETTINGS_ROW_RESTART_FROM;
extern NSString * const SETTINGS_ROW_WHATS_NEW;
extern NSString * const SETTINGS_ROW_WALLPAPER;
extern NSString * const SETTINGS_ROW_GATEWAY;
extern NSString * const SETTINGS_ROW_VERBOSE_LOGS;

typedef enum {
    FolderPickerModeNormal,
    FolderPickerModePicker,
    FolderPickerModeSlider
} FolderPickerMode;