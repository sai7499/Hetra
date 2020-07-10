//
//  FLCOUIUtils.h
//  commons
//
//  Created by Naresh SVS on 24/09/12.
//  Copyright (c) 2012 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "FLCOGenericUtils.h"
#import "FLCOUICommonThemeSettings.h"

#define SB_ITEM_FONT_SIZE 15.3
#define GET_COMMONS_BUNDLE(x) NSBundle *x = [FLCOUIUtils getCommonsResourceBundle]
#define COMMONS_IMAGE_WITH_NAME(name) [FLCOUIUtils getResourceFromCommonsWithName:name]
#define UIColorFromRGB(rgbValue) [UIColor \
colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 \
green:((float)((rgbValue & 0xFF00) >> 8))/255.0 \
blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0]

#define CUSTOM_BAR_BUTTON_ITEM(target, handler, image, title, titleColor, titleFont, tag, backgroundColor) [FLCOUIUtils  getCustomBarButtonWithImage:image forTarget:target andSelector:handler buttonTitle:title titleColor:titleColor titleFont:titleFont withTag:tag buttonBackgroundColor:backgroundColor]

#define IS_IPAD (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
#define IS_RETINA ([[UIScreen mainScreen] scale] >= 2.0)

#define GET_TEMPLATE_IMAGE(x) [FLCOUIUtils getTemplateImage:x]

#define COMMONS_TEMPLATE_IMAGE_WITH_NAME(x) IS_OS_MAJOR_VERSION_LESS_THAN(7)?COMMONS_IMAGE_WITH_NAME(x):[COMMONS_IMAGE_WITH_NAME(x) imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate]
#define COMMONS_IMAGE_WITH_NAME(name) [FLCOUIUtils getResourceFromCommonsWithName:name]

#define GET_COMMONS_BUNDLE_NAME(x) NSString *x = [FLCOUIUtils getCommonsResourceBundleName]
#define GET_RGB_COLOR_OBJ(r,g,b,a) [UIColor colorWithRed:r/255.0f green:g/255.0f blue:b/255.0f alpha:a]

#define DEVICE_SCREEN_WIDTH ([[UIScreen mainScreen] bounds].size.width)
#define DEVICE_SCREEN_HEIGHT ([[UIScreen mainScreen] bounds].size.height)
#define SCREEN_MAX_LENGTH (MAX(DEVICE_SCREEN_WIDTH, DEVICE_SCREEN_HEIGHT))
#define SCREEN_MIN_LENGTH (MIN(DEVICE_SCREEN_WIDTH, DEVICE_SCREEN_HEIGHT))

#define IS_IPHONE (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone)
#define IS_IPHONE_4_OR_LESS (IS_IPHONE && SCREEN_MAX_LENGTH < 568.0)
#define IS_IPHONE_5 (IS_IPHONE && SCREEN_MAX_LENGTH == 568.0)
#define IS_IPHONE_6 (IS_IPHONE && SCREEN_MAX_LENGTH == 667.0)
#define IS_IPHONE_6P (IS_IPHONE && SCREEN_MAX_LENGTH == 736.0)
#define PreferedHeightForCellWithHeight(X) [FLCOUIUtils preferedHeightForCellWithHeight:X]
#define SizeForLabelWithText_fixedWidth_Font(a, b, c) [FLCOUIUtils getSizeForLabelWithText:a andFixedWidth:b andFont:c];


CG_INLINE CGRect
CGRectIntegralScaledEx(CGRect rect, CGFloat scale)
{
    return CGRectMake(floorf(rect.origin.x * scale) / scale, floorf(rect.origin.y * scale) / scale, ceilf(rect.size.width * scale) / scale, ceilf(rect.size.height * scale) / scale);
}

CG_INLINE CGRect
CGRectIntegralScaled(CGRect rect)
{
    return CGRectIntegralScaledEx(rect, [[UIScreen mainScreen] scale]);
}

CG_INLINE CGRect
CGRectIntegralMake(CGFloat x, CGFloat y, CGFloat width, CGFloat height)
{
    return CGRectIntegralScaledEx(CGRectMake(x, y, width, height), [[UIScreen mainScreen] scale]);
}

@interface FLCOUIUtils : NSObject

+ (UIBarButtonItem *) getBackButtonWithText:(NSString *) buttonText forTarget:(id) target andSelector:(SEL) sel;
+ (UIButton *) getFormActionButtonWithText:(NSString *) buttonText;

+ (BOOL) validateEmail: (NSString *) email;

+ (BOOL) validateURL: (NSString *) url;

+ (UIColor *)getNavigationBarDefaultTintColor;

+ (UIColor *)getGrayBackgroundColor;

+ (UIColor *)getGrayTableHeaderLabelColor;

+ (UIColor *)getGroupTableViewBackgroundColor;

+ (UIColor *)getFormViewBackgroundColor;

+(UIColor*)getFormHeaderColor;

+(UIColor*)getFormSubHeaderColor;

+ (UIBarButtonItem *)getCustomBackButtonWithTitle:(NSString *)title image:(UIImage *)image forTarget:(id)target andSelector:(SEL)sel;

+ (UIBarButtonItem *)getCustomBackButtonForBrowserWithTitle:(NSString *)title image:(UIImage *)image forTarget:(id)target andSelector:(SEL)sel withTextColor:(UIColor *)color;

+ (UIBarButtonItem *)getCustomForwardButtonWithImage:(UIImage *)image forTarget:(id)target andSelector:(SEL)sel;

+ (UIBarButtonItem *)getCustomBarButtonWithImage:(UIImage *)image forTarget:(id)target andSelector:(SEL)sel buttonTitle:(NSString*)title titleColor:(UIColor*)color titleFont:(UIFont*)font withTag:(NSInteger)tag buttonBackgroundColor:(UIColor*)color;

+ (UIBarButtonItem *)getCustomBarButtonWithImage:(UIImage *)image title:(NSString*)title forTarget:(id)target andSelector:(SEL)sel;

+ (UIBarButtonItem *) getCustomViewBarButtonWithImg:(UIImage *)image forTarget:(id)target andSelector:(SEL)selector;

+ (void) setText:(NSString*)text onBackButton:(UIButton*)backButton;

//Use to scale an image (icon with standard apple specified app icon size) to launcher image  (72 x72).

+ (UIImage*) getScaledImageForLauncherWithImage:(UIImage*)image;

+ (CGFloat)getTopLayoutGuideLength:(UIViewController*)viewController;

+ (void) showNetworkConnectivityErrorWithTitle:(NSString *)title message:(NSString *)message cancelButtonTitle:(NSString *)cancelButtonTitle;

+ (void)setStatusBarHidden:(BOOL)status;

+ (UIColor*)getNativeMailBadgeCountColor;

+ (void)scrollTextViewOnChange:(UITextView *)textView;

+ (UIImage *)discloserImageWithFrame:(CGRect)rect;

+ (BOOL)getTintColorRed:(CGFloat *)red green:(CGFloat *)green blue:(CGFloat *)blue alpha:(CGFloat *)alpha color:(UIColor*)color;

+ (UIBarButtonItem*)getDarkColorCompliantBarButtonWithImage:(UIImage*)image selectedStateImage:(UIImage*)selectedImage title:(NSString*)title forTarget:(id)target andSelector:(SEL)sel;

+ (UIViewController *) getCurrentForegroundTopViewController;

+ (NSBundle *)getCommonsResourceBundle;

+ (NSString *)getCommonsResourceBundleName;

+ (NSString *)getCommonsBundlePathForImageName:(NSString *)imageName;

+ (UIImage *)getResourceFromCommonsWithName:(NSString *)imageName;

//Added for debug purpose.
+(id)getCurrentFirstResponderItem;

+ (UIColor *) defaultBackgroundColor;

/**
 Returns the size of the given text
 Compatible with iOS 6 and 7 & above
 @param text The text for which to calculate the size
 @param font The intended font with which the text is to be drawn
 @param size The maximum size
 @param lineBreakMode NSLineBreakMode
 @param alignment NSTextAlignment
 @return size The size of the text
 */
+ (CGSize)sizeOfText:(NSString *)text withFont:(UIFont *)font constrainedToSize:(CGSize)size lineBreakMode:(NSLineBreakMode)lineBreakMode;

+ (CGSize)sizeOfText:(NSString *)text withFont:(UIFont *)font;

/**
 Draws the given text with the provided attributes
 Compatible with iOS 6 and 7 & above
 @param text The text to draw
 @param rect The rect in which the text is to be drawn
 @param font The font with which the text is to be drawn
 @param textColor The color with which to draw the text
 @param lineBreakMode NSLineBreakMode
 @param alignment NSTextAlignment
 @return size The size of the text
 */
+ (void)drawText:(NSString *)text inRect:(CGRect)rect withFont:(UIFont *)font textColor:(UIColor *)textColor lineBreakMode:(NSLineBreakMode)lineBreakMode alignment:(NSTextAlignment)alignment;

+ (void)drawText:(NSString *)text inRect:(CGRect)rect withAttributes:(NSDictionary*)attributes;

+ (void)dismissPopOverController:(UIPopoverController *)popover withCompletionBlock:(void (^)())completionBlock;

+ (void) drawLineUsingContext:(CGContextRef)c startPoint:(CGPoint)start endPoint:(CGPoint)end colorRef:(CGColorRef) color  lineWidth:(CGFloat)lineWidth;

+ (UIColor*) getColorForString:(NSString*)colorString;

+ (NSString*) getRGBColorForString:(NSString*)colorString;

+ (NSString*) getColorForRGBString:(NSString*)colorString;


+ (NSArray*) getListOfColors:(BOOL)all;

+ (NSArray*) getToolbarTextColors;

+ (NSArray*) getToolbarTextBackGroundColors;

+ (CGSize)getRequiredHeightOfLabel:(UILabel *)lable withString:(NSString *)data;

+ (UIImage *)imageWithImage:(UIImage *)image scaledToSize:(CGSize)newSize;

+ (CGSize) resizeCGSize:(CGSize)size toFitIntoSize:(CGSize)parentSize withOffset:(CGFloat)offset;

+ (UIImage *)getTemplateImage:(UIImage *)image;

//Returns the height of the cell based on current layout of the subviews using auto layout constarints
+ (CGFloat)systemLayoutFittingSizeForConfiguredCell:(UITableViewCell *)sizingCell;

+ (UIColor *)getDefaultURLBlueColor;
+ (CGFloat)preferedHeightForCellWithHeight:(CGFloat)height;

+ (CGFloat) getStatusBarHeight;

+ (void) adjustSearchControllerFrame:(UISearchController *)searchController;

+ (CGSize) getSizeForLabelWithText: (NSString *) text andFixedWidth: (CGFloat) fixedWidth andFont: (UIFont *) font;

+ (BOOL) isLightColor:(UIColor*)clr;

+ (UIColor *)averageColor:(UIImage*)image;

@end
