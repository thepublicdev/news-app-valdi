import { NavigationPageComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import {
  Label,
  View,
  ImageView,
  ScrollView,
} from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemFont, systemBoldFont } from "valdi_core/src/SystemFont";
import { Article } from "../services/NewsAPIService";
import { WebViewPage } from "./WebViewPage";
import { Device } from "valdi_core/src/Device";

interface ViewModel {
  article: Article;
}

@NavigationPage(module)
export class ArticleDetailPage extends NavigationPageComponent<ViewModel, any> {
  private openURL(url: string) {
    try {
      this.navigationController.push(
        WebViewPage,
        {
          url: url,
          title: "Full Article",
        },
        {}
      );
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  }

  private handleBack = () => {
    this.navigationController.pop();
  };

  onRender(): void {
    const article = this.viewModel.article;

    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();

    <view
      style={styles.container}
      paddingTop={topInset}
      paddingBottom={bottomInset}
    >
      <view style={styles.header} onTap={this.handleBack}>
        <label style={styles.backButton} value="← Back" />
      </view>

      {article.imageUrl && (
        <image src={article.imageUrl} style={styles.image} />
      )}

      <scroll style={styles.content}>
        <label style={styles.title} value={article.title} />

        <view style={styles.meta}>
          <label style={styles.source} value={article.source} />
          {article.author && (
            <label style={styles.author} value={`By ${article.author}`} />
          )}
          <label
            style={styles.date}
            value={new Date(article.publishedAt).toDateString()}
          />
        </view>

        {article.description && (
          <label style={styles.description} value={article.description} />
        )}

        <view
          style={styles.readMoreButton}
          onTap={() => this.openURL(article.url)}
        >
          <label style={styles.readMoreText} value="Read Full Article" />
        </view>
      </scroll>
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
    borderWidth: 0,
    borderColor: "#eeeeee",
  }),
  backButton: new Style<Label>({
    font: systemFont(17),
    color: "#007AFF",
  }),
  image: new Style<ImageView>({
    width: "100%",
    height: 250,
    objectFit: "cover",
  }),
  content: new Style<ScrollView>({
    padding: 20,
    width: "100%",
    flexGrow: 1,
    flexShrink: 1,
  }),
  title: new Style<Label>({
    font: systemBoldFont(24),
    color: "#1a1a1a",
    marginBottom: 16,
    numberOfLines: 0,
  }),
  meta: new Style<View>({
    marginBottom: 16,
  }),
  source: new Style<Label>({
    font: systemBoldFont(14),
    color: "#007AFF",
    marginBottom: 4,
  }),
  author: new Style<Label>({
    font: systemFont(14),
    color: "#666666",
    marginBottom: 4,
  }),
  date: new Style<Label>({
    font: systemFont(12),
    color: "#999999",
  }),
  description: new Style<Label>({
    font: systemFont(16),
    color: "#333333",
    marginBottom: 16,
    numberOfLines: 0,
  }),
  contentText: new Style<Label>({
    font: systemFont(15),
    color: "#333333",
    marginBottom: 20,
    numberOfLines: 0,
  }),
  readMoreButton: new Style<View>({
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  }),
  readMoreText: new Style<Label>({
    font: systemBoldFont(16),
    color: "white",
  }),
};
