//
//  FLCOCertificateDetailViewController.h
//  FLUICommons
//
//  Created by Kinshuk Kar on 17/10/13.
//  Copyright (c) 2013 Naresh SVS. All rights reserved.
//

#import <UIKit/UIKit.h>
typedef NS_ENUM(NSUInteger,CertificateDetailViewType)
{
    CertificateDetailTypeDefault = 1,
    CertificateDetilTypeNoCertRequestField = 2
};

typedef int (^RefreshCertificate)(NSString *templateId);

@interface FLCOCertificateDetailViewController : UITableViewController

@property (retain,nonatomic) NSDictionary *dataSource;

@property (nonatomic, copy) RefreshCertificate refreshCertificate;

@property (nonatomic)CertificateDetailViewType type;

@end