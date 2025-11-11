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
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
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