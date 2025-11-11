/**
 * 
 * WebLauncher - Native bridge for opening URLs
 * 
 * This interface defines the contract for opening URLs in native webviews.
 * The native implementation will handle platform-specific webview creation.
 * 
 * @ExportProxy({
 *   ios: 'SCWebLauncher',
 *   android: 'com.snap.newsapp.WebLauncher'
 * })
 */
export interface WebLauncher {
  /**
   * Opens a URL in the native platform's webview
   * @param url - The URL to open
   */
  openUrl(url: string): void;
}
