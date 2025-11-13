 package com.snap.newsapp

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.AttributeSet
import android.util.Log
import android.view.MotionEvent
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import com.snap.valdi.attributes.AttributesBinder
import com.snap.valdi.attributes.AttributesBindingContext
import com.snap.valdi.attributes.RegisterAttributesBinder

class ValdiWebView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : WebView(context, attrs) {

    init {
        with(settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            builtInZoomControls = true
            displayZoomControls = false
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(true)
            mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        isVerticalScrollBarEnabled = true
        isHorizontalScrollBarEnabled = true
        isClickable = true
        isFocusable = true
        isFocusableInTouchMode = true

        // Handle navigation properly
        webViewClient = object : WebViewClient() {}

        // Ensure parent doesn’t intercept touch events (for scroll & click)
        setOnTouchListener { v, event ->
            if (event.action == MotionEvent.ACTION_DOWN ||
                event.action == MotionEvent.ACTION_MOVE
            ) {
                v.parent?.requestDisallowInterceptTouchEvent(true)
            }
            false // Let WebView handle the event itself
        }
    }

    fun setUrl(url: String) {
        Log.d("ValdiWebView", "Loading URL: $url")
        loadUrl(url)
    }
}

@RegisterAttributesBinder
class ValdiWebViewAttributesBinder(context: Context) : AttributesBinder<ValdiWebView> {
    override val viewClass: Class<ValdiWebView>
        get() = ValdiWebView::class.java

    override fun bindAttributes(
        attributesBindingContext: AttributesBindingContext<ValdiWebView>
    ) {
        attributesBindingContext.bindStringAttribute(
            "url",
            false, // doesn't affect layout
            { view, url, _ -> view.setUrl(url) },
            { _, _ -> /* no-op on reset */ }
        )
    }
}
