import { NavigationPageStatefulComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import {
  Label,
  View,
  ImageView,
  ScrollView,
} from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemFont, systemBoldFont } from "valdi_core/src/SystemFont";
import { Article, NewsAPIService } from "../services/NewsAPIService";
import { WebViewPage } from "./WebViewPage";
import { Device } from "valdi_core/src/Device";

interface ViewModel {
  article: Article;
}

interface State {
  summary: string | null;
  isLoadingSummary: boolean;
  summaryError: string | null;
}

@NavigationPage(module)
export class ArticleDetailPage extends NavigationPageStatefulComponent<ViewModel, any> {
  private newsService: NewsAPIService = new NewsAPIService();
  
  state: State = {
    summary: null,
    isLoadingSummary: false,
    summaryError: null,
  };

  onCreate() {
    // Use the summary from the article if it exists
    if (this.viewModel.article.summary) {
      this.setState({ summary: this.viewModel.article.summary });
    }
  }

  private async generateSummary() {
    this.setState({ isLoadingSummary: true, summaryError: null });
    
    try {
      const result = await this.newsService.generateArticleSummary(this.viewModel.article.id);
      this.setState({ 
        summary: result.summary, 
        isLoadingSummary: false 
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      this.setState({ 
        isLoadingSummary: false,
        summaryError: 'Failed to generate summary. Please try again.' 
      });
    }
  }

  private truncateDescription(text: string, maxLength: number = 300): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

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

        {/* Show summary if available, otherwise show description or truncated description */}
        {this.state.summary ? (
          <view style={styles.summaryContainer}>
            <label style={styles.summaryLabel} value="AI Summary" />
            <label style={styles.summaryText} value={this.state.summary} />
          </view>
        ) : (
          <view>
            {article.description && (
              <label 
                style={styles.description} 
                value={
                  article.description.length > 300 
                    ? this.truncateDescription(article.description, 300)
                    : article.description
                } 
              />
            )}
            
            {/* Show Generate Summary button if no summary exists and description is long */}
            {!this.state.summary && (
              <view
                style={styles.generateSummaryButton}
                onTap={() => this.generateSummary()}
              >
                {this.state.isLoadingSummary ? (
                  <label style={styles.generateSummaryText} value="Generating Summary..." />
                ) : (
                  <label style={styles.generateSummaryText} value="Generate AI Summary" />
                )}
              </view>
            )}
            
            {/* Show error message if summary generation failed */}
            {this.state.summaryError && (
              <label style={styles.errorText} value={this.state.summaryError} />
            )}
          </view>
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
  summaryContainer: new Style<View>({
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  }),
  summaryLabel: new Style<Label>({
    font: systemBoldFont(14),
    color: "#007AFF",
    marginBottom: 8,
  }),
  summaryText: new Style<Label>({
    font: systemFont(15),
    color: "#333333",
    numberOfLines: 0,
  }),
  generateSummaryButton: new Style<View>({
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  }),
  generateSummaryText: new Style<Label>({
    font: systemBoldFont(14),
    color: "white",
  }),
  errorText: new Style<Label>({
    font: systemFont(13),
    color: "#FF3B30",
    marginTop: 8,
    marginBottom: 16,
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
