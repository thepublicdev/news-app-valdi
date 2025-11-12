// ValdiWebView.m
#import "ValdiWebView.h"

// Declare the Valdi binding context method to satisfy the compiler
@interface NSObject (ValdiAttributeBinding)
- (void)bindAttribute:(NSString *)name
invalidateLayoutOnChange:(BOOL)invalidate
      withStringBlock:(void (^)(id view, NSString *value, id animator))applyBlock
           resetBlock:(void (^)(id view, id animator))resetBlock;
@end

@interface ValdiWebView ()
@property (nonatomic, strong) NSString *urlString;
@end

@implementation ValdiWebView

- (instancetype)initWithFrame:(CGRect)frame configuration:(WKWebViewConfiguration *)configuration {
    self = [super initWithFrame:frame configuration:configuration];
    if (self) {
        [self setupWebView];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)coder {
    self = [super initWithCoder:coder];
    if (self) {
        [self setupWebView];
    }
    return self;
}

- (void)setupWebView {
#if TARGET_OS_IPHONE
    // Enable scrolling (iOS only)
    self.scrollView.scrollEnabled = YES;
    self.scrollView.bounces = YES;
    
    // Ensure links are clickable
    self.userInteractionEnabled = YES;
    
    // Disable gesture recognizers that might interfere
    for (UIGestureRecognizer *gesture in self.gestureRecognizers) {
        gesture.delaysTouchesBegan = NO;
        gesture.delaysTouchesEnded = NO;
    }
#endif
    
    // Allow all types of interaction (works on both iOS and macOS)
    self.allowsBackForwardNavigationGestures = YES;
}

- (void)valdi_applyURL:(NSString *)url {
    self.urlString = url;
    if (url && url.length > 0) {
        NSURL *nsUrl = [NSURL URLWithString:url];
        if (nsUrl) {
            NSURLRequest *request = [NSURLRequest requestWithURL:nsUrl];
            [self loadRequest:request];
        }
    }
}

+ (void)bindAttributes:(id)bindingContext {
    [bindingContext bindAttribute:@"url"
         invalidateLayoutOnChange:NO
                  withStringBlock:^(ValdiWebView *view, NSString *url, id animator) {
        [view valdi_applyURL:url];
    }
                       resetBlock:^(ValdiWebView *view, id animator) {
        [view valdi_applyURL:nil];
    }];
}

@end
