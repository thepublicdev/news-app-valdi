import { NavigationPageComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import {
  Label,
  View,
  ImageView,
} from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemFont, systemBoldFont } from "valdi_core/src/SystemFont";
import { NewsArticle } from "../services/NewsAPIService";
import { WebLauncher } from "../services/WebLauncher";

interface ViewModel {
  article: NewsArticle;
}

@NavigationPage(module)
export class ArticleDetailPage extends NavigationPageComponent<ViewModel, any> {
  // Access WebLauncher from context if provided
  private get webLauncher(): WebLauncher | undefined {
    return (this.context as any)?.webLauncher;
  }
  
  private openURL(url: string) {
    try {
      if (this.webLauncher) {
        // Use native webview launcher
        this.webLauncher.openUrl(url);
      } else {
        console.log("WebLauncher not available. URL:", url);
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  }

  private handleBack = () => {
    this.navigationController.pop();
  };

  onRender(): void {
    const article = this.viewModel.article;

    <view style={styles.container}>
      <view style={styles.header} onTap={this.handleBack}>
        <label style={styles.backButton} value="← Back" />
      </view>

      {article.urlToImage && (
        <image src={article.urlToImage} style={styles.image} />
      )}

      <view style={styles.content}>
        <label style={styles.title} value={article.title} />

        <view style={styles.meta}>
          <label style={styles.source} value={article.source.name} />
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

        {article.content && (
          <label style={styles.contentText} value={article.content} />
        )}

        <view
          style={styles.readMoreButton}
          onTap={() => this.openURL(article.url)}
        >
          <label style={styles.readMoreText} value="Read Full Article" />
        </view>
      </view>
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
  content: new Style<View>({
    padding: 20,
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
