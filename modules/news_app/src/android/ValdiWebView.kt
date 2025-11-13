package com.snap.newsapp

import android.content.Context
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

    private var lastTouchX = 0f
    private var lastTouchY = 0f

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

        // Enable both scrollbars
        isVerticalScrollBarEnabled = true
        isHorizontalScrollBarEnabled = true
        
        // Important: Make the view interactive
        isClickable = true
        isFocusable = true
        isFocusableInTouchMode = true

        webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                // Allow navigation within WebView
                return false
            }
        }
    }

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        event ?: return super.onTouchEvent(event)

        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                lastTouchX = event.x
                lastTouchY = event.y
                Log.d("ValdiWebView", "Touch DOWN at (${event.x}, ${event.y})")
                // Tell parent not to intercept touch events
                parent?.requestDisallowInterceptTouchEvent(true)
            }
            MotionEvent.ACTION_MOVE -> {
                val deltaX = Math.abs(event.x - lastTouchX)
                val deltaY = Math.abs(event.y - lastTouchY)

                // Always prevent parent interception when moving
                parent?.requestDisallowInterceptTouchEvent(true)

                // Check if we can scroll in the direction the user is trying to scroll
                val canScrollHorizontally = canScrollHorizontally(
                    if (event.x < lastTouchX) 1 else -1
                )
                val canScrollVertically = canScrollVertically(
                    if (event.y < lastTouchY) 1 else -1
                )

                Log.d("ValdiWebView", "Touch MOVE to (${event.x}, ${event.y}) - " +
                      "deltaX: $deltaX, deltaY: $deltaY, " +
                      "canScrollH: $canScrollHorizontally, canScrollV: $canScrollVertically")

                // If we can't scroll in either direction, let parent handle it
                if (!canScrollHorizontally && !canScrollVertically) {
                    parent?.requestDisallowInterceptTouchEvent(false)
                } else {
                    parent?.requestDisallowInterceptTouchEvent(true)
                }

                lastTouchX = event.x
                lastTouchY = event.y
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                val action = if (event.action == MotionEvent.ACTION_UP) "UP" else "CANCEL"
                Log.d("ValdiWebView", "Touch $action at (${event.x}, ${event.y})")
                // Allow parent to intercept again
                parent?.requestDisallowInterceptTouchEvent(false)
            }
        }

        return super.onTouchEvent(event)
    }

    override fun onOverScrolled(
        scrollX: Int,
        scrollY: Int,
        clampedX: Boolean,
        clampedY: Boolean
    ) {
        super.onOverScrolled(scrollX, scrollY, clampedX, clampedY)
        
        // If we've reached the edge, allow parent to intercept
        if (clampedX || clampedY) {
            parent?.requestDisallowInterceptTouchEvent(false)
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