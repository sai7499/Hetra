/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * This file is part of PhotoScrollerNetwork -- An iOS project that smoothly and efficiently
 * renders large images in progressively smaller ones for display in a CATiledLayer backed view.
 * Images can either be local, or more interestingly, downloaded from the internet.
 * Images can be rendered by an iOS CGImageSource, libjpeg-turbo, or incrmentally by
 * libjpeg (the turbo version) - the latter gives the best speed.
 *
 * Parts taken with minor changes from Apple's PhotoScroller sample code, the
 * ConcurrentOp from my ConcurrentOperations github sample code, and TiledImageBuilder
 * was completely original source code developed by me.
 *
 * Copyright 2012-2014 David Hoerl All Rights Reserved.
 *
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY David Hoerl ''AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL David Hoerl OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *
 * Notes:
 * 1) How to use the "size" init parameter.
 *    You should set the height and width of the size parameter to the smallest dimension used 
 *    to display the image. For instance, if you will only display the image in a view of 200, 300,
 *    then use those numbers. If you support both landscape and portrait, then use 200, 200, since 
 *    at some point each dimension will have a minimum of 200 points. If doing full screen then the
 *    numbers will be 320,480 for portrait only, or 320,320 if you support multiple orientations.
 * 
 * 2) Orientation.
 *    JPEG images often have an "orientation" property which defines how the image is oriented.
 *    You can find references to this online, and will see that images can be rotated and flipped in
 *    one of 8 ways, with "1" being as laid out in memory. This class lets you define one of 9 values
 *    to orientation, 0-8. Use "0" if you want this class to look in the properties dictionary, and
 *    set orientation to the specified value (if any). Or, if you want to force an orientation, pass
 *    that value in during initialization, and the image will be forced to that orientation. For
 *    instance, set it to "1" to force the images to be shown as they are stored in memory.
 *
 *      1        2       3      4         5            6           7          8
 * 
 *    888888  888888      88  88      8888888888  88                  88  8888888888
 *    88          88      88  88      88  88      88  88          88  88      88  88
 *    8888      8888    8888  8888    88          8888888888  8888888888          88
 *    88          88      88  88
 *    88          88  888888  888888
 *
 */

#import <UIKit/UIKit.h>
typedef NS_ENUM(NSInteger, imageDecoder) {
    cgimageDecoder=0,		// Use CGImage
    libjpegTurboDecoder,	// Use libjpeg-turbo, but not incrementally (used when loading a local file)
    libjpegIncremental		// Used when we download a file from the web, so we can process it a chunk at a time.
};

#define ZOOM_LEVELS			 4
#define TILE_SIZE			256		// could make larger or smaller, but power of 2
#define ANNOTATE_TILES		YES

@interface TiledImageBuilder : NSObject
@property (nonatomic, strong, readonly) NSDictionary *properties;	// image properties from CGImageSourceCopyPropertiesAtIndex()
@property (nonatomic, assign) NSInteger orientation;				// 0 == automatically set using EXIF orientation from image
@property (nonatomic, assign) NSUInteger zoomLevels;				// explose the init setting
@property (nonatomic, assign) uint64_t startTime;					// time stamp of when this operation started decoding
@property (nonatomic, assign) uint64_t finishTime;					// time stamp of when this operation finished  decoding
@property (nonatomic, assign) uint32_t milliSeconds;				// elapsed time
@property (nonatomic, assign) int32_t ubc_threshold;				// UBC threshold above which outstanding writes are flushed to the file system (dynamic default)
@property (nonatomic, assign, readonly) BOOL failed;				// global Error flags

+ (void)setUbcThreshold:(float)val;									// default is 0.5 - Image disk cache can use half of the available free memory pool

#if LEVELS_INIT == 0
- (id)initWithImage:(CGImageRef)image size:(CGSize)sz orientation:(NSInteger)orientation;
- (id)initWithImagePath:(NSString *)path withDecode:(imageDecoder)decoder size:(CGSize)sz orientation:(NSInteger)orientation;
- (id)initForNetworkDownloadWithDecoder:(imageDecoder)dec size:(CGSize)sz orientation:(NSInteger)orientation;
#else
- (id)initWithImage:(CGImageRef)image levels:(NSUInteger)levels orientation:(NSInteger)orientation;
- (id)initWithImagePath:(NSString *)path withDecode:(imageDecoder)decoder levels:(NSUInteger)levels orientation:(NSInteger)orientation;
- (id)initForNetworkDownloadWithDecoder:(imageDecoder)dec levels:(NSUInteger)levels orientation:(NSInteger)orientation;
#endif

- (void)writeToImageFile:(NSData *)data;
- (void)dataFinished;
- (CGSize)imageSize;	// orientation modifies over what is downloaded

@end

@interface TiledImageBuilder (Draw)

- (CGImageRef)newImageForScale:(CGFloat)scale location:(CGPoint)pt box:(CGRect)box;
- (UIImage *)tileForScale:(CGFloat)scale location:(CGPoint)pt; // used when doing drawRect, but now for getImageColor
- (CGAffineTransform)transformForRect:(CGRect)box; //  scale:(CGFloat)scale;
- (CGPoint)translateTileForScale:(CGFloat)scale location:(CGPoint)origPt;

@end

#ifdef LIBJPEG
@interface TiledImageBuilder (JPEG_PUB)

- (BOOL)jpegAdvance:(NSData *)data;

@end
#endif
