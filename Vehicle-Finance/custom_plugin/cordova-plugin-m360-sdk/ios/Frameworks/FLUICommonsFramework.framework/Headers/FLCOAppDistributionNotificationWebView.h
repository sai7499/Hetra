//
//  FLCRAppDistributionNotificationWebView.h
//  core
//
//  Created by Satya Prakash on 8/13/15.
//
//

#import <UIKit/UIKit.h>

@interface FLCOAppDistributionNotificationWebView : UIViewController

@property (weak, nonatomic) IBOutlet UIWebView *webView;
@property (nonatomic,strong) NSString* urlString;

@end
