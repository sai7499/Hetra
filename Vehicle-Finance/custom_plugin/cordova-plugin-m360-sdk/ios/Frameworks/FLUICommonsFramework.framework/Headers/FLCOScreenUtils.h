//
//  FLCOScreenUtils.h
//  commons
//
//  Created by Mudireddy Suresh on 22/01/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/** Float: Portrait Screen Height **/
#define SCREEN_HEIGHT_PORTRAIT ( [[UIScreen mainScreen ] bounds ].size.height )

/** Float: Portrait Screen Width **/
#define SCREEN_WIDTH_PORTRAIT ( [[UIScreen mainScreen ] bounds ].size.width )

/** Float: Landscape Screen Height **/
#define SCREEN_HEIGHT_LANDSCAPE ( [[UIScreen mainScreen ] bounds ].size.width )

/** Float: Landscape Screen Width **/
#define SCREEN_WIDTH_LANDSCAPE ( [[UIScreen mainScreen ] bounds ].size.height )

/** CGRect: Portrait Screen Frame **/
#define SCREEN_FRAME_PORTRAIT ( CGRectMake( 0, 0, SCREEN_WIDTH_PORTRAIT , SCREEN_HEIGHT_PORTRAIT ) )

/** CGRect: Landscape Screen Frame **/
#define SCREEN_FRAME_LANDSCAPE ( CGRectMake( 0, 0, SCREEN_WIDTH_LANDSCAPE , SCREEN_HEIGHT_LANDSCAPE ) )

/** Float: Screen Scale **/
#define SCREEN_SCALE ([[UIScreen mainScreen] scale ] )

/** CGSize: Screen Size Portrait **/
#define SCREEN_SIZE_PORTRIAT ( CGSizeMake( SCREEN_WIDTH_PORTRAIT * SCREEN_SCALE , SCREEN_HEIGHT_PORTRAIT * SCREEN_SCALE ) )

/** CGSize: Screen Size Landscape **/
#define SCREEN_SIZE_LANDSCAPE ( CGSizeMake( SCREEN_WIDTH_LANDSCAPE * SCREEN_SCALE , SCREEN_HEIGHT_LANDSCAPE * SCREEN_SCALE ) )

@interface FLCOScreenUtils : NSObject

+(CGRect)getApplicationScreenBoundsForPotraitMode;
+(CGRect)getApplicationScreenBoundsForLandscapeMode;

@end
