//
//  FLCOProgressView.h
//  FLUICommons
//
//  Created by Apoorv on 7/13/15.
//  Copyright (c) 2015 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ProgressType)
{
    DEFINITE=0,
    INDEFINITE=1
};

@interface FLCOProgressView : UIView

/**
 *  Initialize's the view with ProgressType and Frame
 *
 *  @param type  type of the progress. Use enum ProgressType
 *  @param frame frame which this view should use
 *
 *  @return new instance of FLCOProgressView
 */
-(id)initWithType:(ProgressType)type withFrame:(CGRect)frame;

/**
 *  Update's UI to show progress as sent in method if progress is DEFINITE. For INDEFINITE process it has no effect
 *
 *  @param progress progress between 0 to 1 in float value
 */
-(void)updateProgress:(NSNumber *)progress;

/**
 *  Start animation of progress bar
 */
-(void)start;

/**
 *  Stop animation of progress bar
 */
-(void)stop;

-(void)applyColorToProgressView:(UIColor *)color;

@end
