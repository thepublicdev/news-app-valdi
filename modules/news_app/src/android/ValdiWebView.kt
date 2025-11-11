package com.snap.newsapp

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.view.MotionEvent
import android.webkit.WebView
import android.webkit.WebViewClient
import com.snap.valdi.attributes.AttributesBinder
import com.snap.valdi.attributes.AttributesBindingContext
import com.snap.valdi.attributes.RegisterAttributesBinder

class ValdiWebView(context: Context) : WebView(context) {
    init {
        // Enable JavaScript
        settings.javaScriptEnabled = true
        
        // Enable DOM storage for modern web content
        settings.domStorageEnabled = true
        
        // Enable zooming and controls
        settings.builtInZoomControls = true
        settings.displayZoomControls = false
        
        // Enable scrolling and touch
        isVerticalScrollBarEnabled = true
        isHorizontalScrollBarEnabled = true
        
        // CRITICAL: Enable touch and click events
        isClickable = true
        isFocusable = true
        isFocusableInTouchMode = true
        
        // Request focus so WebView receives touch events
        requestFocus()
        
        // CRITICAL: Request that parent doesn't intercept touch events
        requestDisallowInterceptTouchEvent(true)
        
        // Set WebViewClient to handle links
        webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                // Load URLs within the WebView instead of opening external browser
                view.loadUrl(url)
                return true
            }
        }
        
        // Additional settings for better compatibility
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.setSupportZoom(true)
        
        // Enable mixed content (http and https)
        settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
    }
    
    fun setUrl(url: String) {
        loadUrl(url)
        // Request focus again after loading URL
        requestFocus()
    }
    
    override fun dispatchTouchEvent(event: MotionEvent?): Boolean {
        // Log ALL touch events to see if we're receiving them
        Log.d("ValdiWebView", "dispatchTouchEvent: ${event?.action}")
        
        // Request that parent doesn't intercept
        parent?.requestDisallowInterceptTouchEvent(true)
        
        // Let the WebView handle the touch event
        return super.dispatchTouchEvent(event)
    }
    
    override fun onTouchEvent(event: MotionEvent?): Boolean {
        // Log touch events for debugging
        Log.d("ValdiWebView", "onTouchEvent: ${event?.action}")
        
        // Ensure we request focus and disallow parent intercept on touch down
        if (event?.action == MotionEvent.ACTION_DOWN) {
            requestFocus()
            parent?.requestDisallowInterceptTouchEvent(true)
        }
        
        // Let the WebView handle the touch event
        return super.onTouchEvent(event)
    }
    
    override fun onInterceptTouchEvent(event: MotionEvent?): Boolean {
        // Request that parent doesn't intercept
        parent?.requestDisallowInterceptTouchEvent(true)
        return super.onInterceptTouchEvent(event)
    }
    
    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        Log.d("ValdiWebView", "WebView size: $w x $h")
    }
}

@RegisterAttributesBinder
class ValdiWebViewAttributesBinder(context: Context) : AttributesBinder<ValdiWebView> {
    // ☝️ Add the context parameter to the constructor
    
    override val viewClass: Class<ValdiWebView>
        get() = ValdiWebView::class.java
    
    override fun bindAttributes(
        attributesBindingContext: AttributesBindingContext<ValdiWebView>
    ) {
        attributesBindingContext.bindStringAttribute(
            "url",
            false, // doesn't affect layout
            { view, url, animator -> view.setUrl(url) },
            { view, animator -> /* no-op on reset */ }
        )
    }
}