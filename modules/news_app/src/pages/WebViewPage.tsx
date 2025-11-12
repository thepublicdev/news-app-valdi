import { NavigationPageComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import { Label, View } from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemFont } from "valdi_core/src/SystemFont";
import { Device } from "valdi_core/src/Device";

interface ViewModel {
  url: string;
  title?: string;
}

@NavigationPage(module)
export class WebViewPage extends NavigationPageComponent<ViewModel, any> {
  private handleBack = () => {
    this.navigationController.pop();
  };

  onRender(): void {
    const { url, title } = this.viewModel;

    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();

    console.log("Opening URL in WebViewPage:", url);

    <view
      style={styles.container}
      paddingTop={topInset}
      paddingBottom={bottomInset}
    >
      <view style={styles.header}>
        <view style={styles.headerContent} onTap={this.handleBack}>
          <label style={styles.backButton} value="← Back" />
        </view>
      </view>

      <custom-view
        style={styles.webview}
        iosClass="ValdiWebView"
        androidClass="com.snap.newsapp.ValdiWebView"
        url={url}
        pointerEvents="auto"
      />
    </view>;
  }
}

const styles = {
  container: new Style<View>({
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flexDirection: "column",
  }),
  header: new Style<View>({
    padding: 16,
    backgroundColor: "white",
  }),
  headerContent: new Style<View>({
    flexDirection: "row",
    alignItems: "center",
  }),
  backButton: new Style<Label>({
    font: systemFont(17),
    color: "#007AFF",
    marginRight: 12,
  }),
  headerTitle: new Style<Label>({
    font: systemFont(17),
    color: "#1a1a1a",
  }),
  webview: new Style<View>({
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
    minHeight: 0, // Important: allows flex child to shrink below content size
  }),
};
