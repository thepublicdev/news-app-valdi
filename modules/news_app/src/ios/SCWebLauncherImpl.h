//
//  SCWebLauncherImpl.h
//  NewsApp
//
//  WebLauncher implementation for iOS that opens URLs in SFSafariViewController
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol SCWebLauncher;

/**
 * Implementation of WebLauncher that opens URLs using SFSafariViewController.
 * This provides an in-app browser experience on iOS.
 */
@interface SCWebLauncherImpl : NSObject <SCWebLauncher>

/**
 * The view controller used to present the Safari view controller.
 * This should be set to the current view controller that will present the web view.
 */
@property (nonatomic, weak) UIViewController *presentingViewController;

/**
 * Initializes the WebLauncher with a presenting view controller.
 *
 * @param viewController The view controller that will present the Safari view controller
 * @return An initialized WebLauncher instance
 */
- (instancetype)initWithViewController:(UIViewController *)viewController;

@end

NS_ASSUME_NONNULL_END
