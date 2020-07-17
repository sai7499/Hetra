//
//  VerticallyAlignedLabel.h
//  MaaS360
//
//  Created by Suresh Mudireddy on 21/10/11.
//  Copyright 2011 Fiberlink Communications Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UILabel.h>


typedef enum VerticalAlignment {
 VerticalAlignmentTop,
 VerticalAlignmentMiddle,
 VerticalAlignmentBottom,
} VerticalAlignment;

@interface VerticallyAlignedLabel : UILabel {
@private
 VerticalAlignment verticalAlignment_;
}

@property (nonatomic, assign) VerticalAlignment verticalAlignment;

@end
