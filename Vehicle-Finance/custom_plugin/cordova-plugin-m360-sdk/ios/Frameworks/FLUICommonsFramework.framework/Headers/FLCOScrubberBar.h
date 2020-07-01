//
//  FLCOScrubberBar.h
//  FLUICommons
//
//  Created by Mayur Kothawade  on 8/5/16.
//  Copyright © 2016 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class FLCOScrubberBar;

@protocol FLCOScrubberbarDelegate <NSObject>

@required

/**
 *  Called on when Dragger is moved resulting value changed event.
 *
 *  @param scrollBar FLCOScrubberBar scrollbar
 *  @param value     changed value
 */
-(void)scrubberBar:(FLCOScrubberBar*)scrubberBar valueChanged:(int)value;

@optional
/**
 *  Called on when Dragger is touch up inside (drag finished) event.
 *
 *  @param scrollBar FLCOScrubberBar scrollbar
 *  @param value     changed value
 */
-(void)scrubberBar:(FLCOScrubberBar*)scrubberBar touchUpInside:(int)value;

@end

@interface FLCOScrubberBar : UISlider

@property (nonatomic, weak) id<FLCOScrubberbarDelegate> scrubberBarDelegate;

/**
 *  Initialize  FLCOScrubberBar with params
 *
 *  @param containerView  container view in which the M360PDFDragScrollbar is tobe placed
 *  @param dragImg        drag view image
 *  @param minVal         minimum value for tracker
 *  @param maxVal         maximum value for tracker
 *  @param trackerVisible tracker visible or not
 *  @param isVertical     is vertically aligned
 *  @param delegate       delegate controller
 *
 *  @return FLCOScrubberBar
 */
-(instancetype)initWithContainerView:(UIView*)containerView dragImage:(UIImage*)dragImg minValue:(int)minVal maxValue:(int)maxVal showTracker:(BOOL)trackerVisible showVertical:(BOOL)isVertical delegate:(id)delegate;

/**
 *  Set Drag Value
 *
 *  @param value drag value
 */
-(void)setDragValue:(float)value;


@end
