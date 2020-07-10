//
//  FLCOWhatsNewCollectionViewCell.h
//  FLUICommons
//
//  Created by Suresh Mudireddy on 09/04/15.
//  Copyright (c) 2015 Fiberlink Communications Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

///	Describes the kind of layout of the cell.
typedef NS_ENUM(NSUInteger, FLCOWhatsNewCollectionViewCellLayoutStyle){
    ///	For use in a list. The image appears on the left and the left-align text appears stacked to the right of the image.
    FLCOWhatsNewCollectionViewCellLayoutStyleList,
    ///	For use in a grid. The image appears above the text and everything is center aligned.
    FLCOWhatsNewCollectionViewCellLayoutStyleGrid
};

@interface FLCOWhatsNewCollectionViewCell : UICollectionViewCell

///	The title of the feature.
@property (nonatomic, copy) NSString *title;

///	A short description of the feature.
@property (nonatomic, copy) NSString *detail;

/// An image represeting the feature.
@property (nonatomic, copy) UIImage *icon;

///	The color to use for the content.
@property (nonatomic, copy) UIColor *contentColor;

///	The style of the layout.
@property (nonatomic) FLCOWhatsNewCollectionViewCellLayoutStyle layoutStyle;

@end
