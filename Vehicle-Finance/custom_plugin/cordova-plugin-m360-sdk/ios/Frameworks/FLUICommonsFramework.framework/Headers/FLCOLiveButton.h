//
//  FLCOLiveButton.h
//
//
//  Created by Sebastien Windal on 2/24/14.
//  MIT license.
/*
 
 Copyright (c) 2014 Sebastien Windal
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
//

#import <UIKit/UIKit.h>


typedef enum {
    kLiveButtonStyleHamburger,
    kLiveButtonStyleClose,
    kLiveButtonStylePlus,
    kLiveButtonStyleCirclePlus,
    kLiveButtonStyleCircleClose,
    kLiveButtonStyleCaretUp,
    kLiveButtonStyleCaretDown,
    kLiveButtonStyleCaretLeft,
    kLiveButtonStyleCaretRight,
    kLiveButtonStyleArrowLeft,
    kLiveButtonStyleArrowRight
} kLiveButtonStyle;

@interface FLCOLiveButton : UIButton

-(kLiveButtonStyle) buttonStyle;

-(void) setStyle:(kLiveButtonStyle)style animated:(BOOL)animated;

@property (nonatomic, strong) NSDictionary *options;
+(NSDictionary *) defaultOptions;

// button customization options:

// scale to apply to the button CGPath(s) when the button is pressed. Default is 0.9:
extern NSString *const kLiveButtonHighlightScale;
// the button CGPaths stroke width, default 1.0f pixel
extern NSString *const kLiveButtonLineWidth;
// the button CGPaths stroke color, default is black
extern NSString *const kLiveButtonColor;
// the button CGPaths stroke color when highlighted, default is light gray
extern NSString *const kLiveButtonHighlightedColor;
// duration in second of the highlight (pressed down) animation, default 0.1
extern NSString *const kLiveButtonHighlightAnimationDuration;
// duration in second of the unhighlight (button release) animation, defualt 0.15
extern NSString *const kLiveButtonUnHighlightAnimationDuration;
// duration in second of the style change animation, default 0.3
extern NSString *const kLiveButtonStyleChangeAnimationDuration;


@end
