import { NavigationPageComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import { Label, View } from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemFont } from "valdi_core/src/SystemFont";

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

    console.log("Opening URL in WebViewPage:", url);

    <view style={styles.container}>
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
      />
    </view>;
  }
}

const styles = {
  container: new Style<View>({
    width: "100%",
    height: "100%",
    backgroundColor: "white",
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
    width: "100%",
    height: "100%",
  }),
};
