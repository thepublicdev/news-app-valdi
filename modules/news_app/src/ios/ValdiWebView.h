// ValdiWebView.h
#import <WebKit/WebKit.h>
#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#else
#import <Cocoa/Cocoa.h>
#endif

@interface ValdiWebView : WKWebView

+ (void)bindAttributes:(id)bindingContext;

@end
