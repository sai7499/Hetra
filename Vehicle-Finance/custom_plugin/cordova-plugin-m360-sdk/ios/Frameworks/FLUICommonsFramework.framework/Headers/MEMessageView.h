//
//  MEMessageView.h
//  MaaS360
//
//  Created by vpally on 25/03/11.
//  Copyright 2011 Fiberlink Communications Corp. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface MEMessageView : UIView
{
	BOOL						needSpinner;
    UIInterfaceOrientation orientation;
	UIActivityIndicatorView *spinner;
    UILabel* titleLabel;
    UIImageView* imageView;
}

- (id)initWithTitle:(NSString*)title;

- (void)displaySpinner:(BOOL)show;
- (void)setMessage:(NSString *)message;
- (void)setImage:(UIImage*)image;
- (void)setOrientation:(UIInterfaceOrientation)orientation;

- (void)show;

- (void)showRelativeToParentView:(UIView *)view;

- (void)showWithOffset:(CGPoint)offset;

- (void)dismissAnimated:(BOOL)animated;

@end
