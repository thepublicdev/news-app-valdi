package com.snap.newsapp

import android.content.Context
import android.webkit.WebView
import android.webkit.WebViewClient
import com.snap.valdi.attributes.AttributesBinder
import com.snap.valdi.attributes.AttributesBindingContext
import com.snap.valdi.attributes.RegisterAttributesBinder

class ValdiWebView(context: Context) : WebView(context) {
    init {
        webViewClient = WebViewClient()
        settings.javaScriptEnabled = true
    }
    
    fun setUrl(url: String) {
        loadUrl(url)
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