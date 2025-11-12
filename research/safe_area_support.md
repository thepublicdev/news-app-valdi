Looking at the Valdi codebase to find SafeArea functionality...Yes! Valdi does have safe area inset support, though it's implemented differently than Flutter's `SafeArea` widget.

## Safe Area Insets in Valdi

Valdi provides **device inset information** through its Device API rather than a dedicated wrapper component. Here's how it works:

### Web Platform
The web implementation reads CSS environment variables for safe area insets:

```typescript name=DeviceBridge.ts url=https://github.com/Snapchat/Valdi/blob/bfff1d6420f96367ba23a2329d0e256561df92a7/src/valdi_modules/src/valdi/valdi_core/web/DeviceBridge.ts#L28-L44
function getSafeAreaInset(side: 'top' | 'right' | 'bottom' | 'left'): number {
  if (!isBrowser || !window.getComputedStyle) return 0;
  // Read CSS env(safe-area-inset-*) via a temporary element
  const el = document.createElement('div');
  el.style.cssText = `
    position: absolute;
    ${side}: 0;
    width: 0;height: 0;
    padding-${side}: env(safe-area-inset-${side});
    visibility: hidden;
  `;
  document.body.appendChild(el);
  const px = getComputedStyle(el).getPropertyValue(`padding-${side}`).trim();
  el.remove();
  const n = parseFloat(px || '0');
  return Number.isFinite(n) ? n : 0;
}
```

### Accessing Safe Area Insets

You can access safe area insets through these device bridge functions:

```typescript
export function getDisplayTopInset(): number
export function getDisplayBottomInset(): number  
export function getDisplayLeftInset(): number
export function getDisplayRightInset(): number
```

### iOS Implementation
On iOS, Valdi automatically handles safe area insets through the root view's `safeAreaInsetsDidChange` method, which posts notifications when insets change.

### Usage Pattern
Unlike Flutter's `SafeArea` wrapper component, in Valdi you would typically:
1. Import the device bridge functions
2. Query the inset values
3. Apply them as padding/margin in your component's layout

The approach is more **imperative** (you query the values) rather than **declarative** (wrapping content in a component), but it gives you the same information to avoid notches, home indicators, and status bars.


## Basic Usage with Device API

The recommended approach is to use the `Device` module to get inset values and apply them as padding:

```typescript name=MyPage.tsx
import { Component } from 'valdi_core/src/Component';
import { Device } from 'valdi_core/src/Device';

class MyPage extends Component {
  onRender() {
    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();
    
    <view 
      backgroundColor='#FFFC00'
      paddingTop={topInset}
      paddingBottom={bottomInset}
    >
      <label value='Content is safe from notches!' />
    </view>;
  }
}
```

## Better Approach: Use `<WithInsets/>` (Recommended)

According to the documentation warnings, Valdi recommends using the `<WithInsets/>` component or `Device.observeDisplayInsetChange()` instead of directly calling the inset functions, because **insets are dynamic values** that can change (e.g., when rotating the device or keyboard appears).

The `<WithInsets/>` component automatically reacts to inset changes:

```typescript name=MyPageWithInsets.tsx
import { Component } from 'valdi_core/src/Component';
import { WithInsets } from 'valdi_core/src/WithInsets';

class MyPage extends Component {
  onRender() {
    <WithInsets>
      {(insets) => (
        <view 
          backgroundColor='#FFFC00'
          paddingTop={insets.top}
          paddingBottom={insets.bottom}
          paddingLeft={insets.left}
          paddingRight={insets.right}
        >
          <label value='Content is safe from notches!' />
        </view>
      )}
    </WithInsets>;
  }
}
```

## Observable Pattern for Dynamic Updates

If you need more control, use the observable pattern:

```typescript name=MyPageObservable.tsx
import { Component } from 'valdi_core/src/Component';
import { Device } from 'valdi_core/src/Device';

class MyPage extends Component {
  private insetObserver;
  
  onMount() {
    this.insetObserver = Device.observeDisplayInsetChange(() => {
      // Insets changed, trigger re-render
      this.forceUpdate();
    });
  }
  
  onUnmount() {
    this.insetObserver?.cancel();
  }
  
  onRender() {
    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();
    
    <view paddingTop={topInset} paddingBottom={bottomInset}>
      <label value='Dynamically safe content!' />
    </view>;
  }
}
```

## Key Differences from Flutter

- **Flutter**: Wraps content in `SafeArea` widget (declarative wrapper)
- **Valdi**: Query inset values and apply as padding (imperative), or use `<WithInsets/>` for reactive updates

Both achieve the same result of avoiding system UI elements like notches, status bars, and home indicators!