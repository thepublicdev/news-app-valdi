import { NavigationPageStatefulComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import { Label, View } from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemBoldFont } from "valdi_core/src/SystemFont";
import { NewsArticle } from "../services/NewsAPIService";
import { NewsList } from "../components/NewsList";
import { App } from "../App";
import { SearchPage } from "./SearchPage";
import { ArticleDetailPage } from "./ArticleDetailPage";
import { Device } from "valdi_core/src/Device";

interface State {
  articles: NewsArticle[];
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
}

@NavigationPage(module)
export class NewsListPage extends NavigationPageStatefulComponent<{}, any> {
  state: State = {
    articles: [],
    selectedCategory: "general",
    isLoading: false,
    error: null,
  };

  onCreate(): void {
    this.loadNews();
  }

  private async loadNews(category?: string) {
    const selectedCategory = category || this.state.selectedCategory;
    this.setState({ isLoading: true, error: null });
    try {
      const articles = await App.newsService.getTopHeadlines(
        "us",
        selectedCategory
      );
      this.setState({ articles, isLoading: false });
    } catch (error) {
      console.error("Failed to load news:", error);
      this.setState({
        error: "Failed to load news. Please check your API key and connection.",
        isLoading: false,
      });
    }
  }

  private handleCategoryChange = async (category: string) => {
    this.setState({ selectedCategory: category });
    await this.loadNews(category);
  };

  private handleArticleTap = (article: NewsArticle) => {
    // Pass the webLauncher context from this page's context to the detail page
    this.navigationController.push(
      ArticleDetailPage,
      { article },
      this.context
    );
  };

  private handleSearchTap = () => {
    this.navigationController.push(SearchPage, {}, {});
  };

  private handleRefresh = async () => {
    await this.loadNews();
  };

  onRender(): void {
    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();

    console.log("Top Inset:", topInset, "Bottom Inset:", bottomInset);

    if (this.state.isLoading && this.state.articles.length === 0) {
      <view
        style={styles.container}
      >
        <view style={styles.loadingContainer}>
          <label style={styles.loadingText} value="Loading news..." />
        </view>
      </view>;
      return;
    }

    if (this.state.error) {
      <view style={styles.container}>
        <view style={styles.errorContainer}>
          <label style={styles.errorText} value={this.state.error} />
          <view style={styles.retryButton} onTap={this.handleRefresh}>
            <label style={styles.retryButtonText} value="Retry" />
          </view>
        </view>
      </view>;
      return;
    }

    <view style={styles.container}
            paddingTop={topInset}
        paddingBottom={bottomInset}>
      <NewsList
        articles={this.state.articles}
        selectedCategory={this.state.selectedCategory}
        onArticleTap={this.handleArticleTap}
        onCategoryChange={this.handleCategoryChange}
        onRefresh={this.handleRefresh}
        onSearchTap={this.handleSearchTap}
      />
    </view>;
  }
}

const styles = {
  container: new Style<View>({
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  }),
  loadingContainer: new Style<View>({
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  }),
  loadingText: new Style<Label>({
    font: systemBoldFont(16),
    color: "#666666",
  }),
  errorContainer: new Style<View>({
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  }),
  errorText: new Style<Label>({
    font: systemBoldFont(16),
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
    numberOfLines: 0,
  }),
  retryButton: new Style<View>({
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  }),
  retryButtonText: new Style<Label>({
    font: systemBoldFont(16),
    color: "white",
  }),
};
