// ValdiWebView.swift
import WebKit
import Foundation

@objc class ValdiWebView: WKWebView {
    @objc var urlString: String? {
        didSet {
            if let urlString = urlString, let url = URL(string: urlString) {
                self.load(URLRequest(url: url))
            }
        }
    }
    
    override init(frame: CGRect, configuration: WKWebViewConfiguration) {
        super.init(frame: frame, configuration: configuration)
        setupWebView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupWebView()
    }
    
    private func setupWebView() {
        // Enable scrolling
        self.scrollView.isScrollEnabled = true
        self.scrollView.bounces = true
        
        // Allow all types of interaction
        self.allowsBackForwardNavigationGestures = true
        
        // Ensure links are clickable
        self.isUserInteractionEnabled = true
        
        // Disable gesture recognizers that might interfere
        for gesture in self.gestureRecognizers ?? [] {
            gesture.delaysTouchesBegan = false
            gesture.delaysTouchesEnded = false
        }
    }
    
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        // Log hit testing for debugging
        NSLog("ValdiWebView hitTest at: \(point)")
        return super.hitTest(point, with: event)
    }
    
    // Bind the url attribute to Valdi
    @objc static func bindAttributes(_ bindingContext: SCValdiAttributesBindingContext) {
        bindingContext.bindAttribute(
            "url",
            invalidateLayoutOnChange: false,
            withStringBlock: { (view: ValdiWebView, url: String, animator: SCValdiAnimator?) in
                view.urlString = url
            },
            resetBlock: { (view: ValdiWebView, animator: SCValdiAnimator?) in
                view.urlString = nil
            }
        )
    }
}