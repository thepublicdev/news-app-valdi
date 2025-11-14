import { NavigationPageStatefulComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import { Label, View } from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemBoldFont } from "valdi_core/src/SystemFont";
import { Article, Source } from "../services/NewsAPIService";
import { NewsList } from "../components/NewsList";
import { App } from "../App";
import { ArticleDetailPage } from "./ArticleDetailPage";
import { Device } from "valdi_core/src/Device";

interface State {
  articles: Article[];
  sources: Source[];
  selectedSource: string | null;
  isLoading: boolean;
  isLoadingSources: boolean;
  error: string | null;
}

@NavigationPage(module)
export class NewsListPage extends NavigationPageStatefulComponent<{}, any> {
  state: State = {
    articles: [],
    sources: [],
    selectedSource: null,
    isLoading: false,
    isLoadingSources: false,
    error: null,
  };

  onCreate(): void {
    this.loadSources();
  }

  private async loadSources() {
    this.setState({ isLoadingSources: true, error: null });
    try {
      const sources = await App.newsService.getSources(true); // Only enabled sources
      console.log("Loaded sources:", sources.length);
      
      this.setState({
        sources,
        selectedSource: null, // Start with "All Sources"
        isLoadingSources: false,
      });
      
      // Load all articles (no source filter)
      await this.loadArticles();
    } catch (error) {
      console.error("Failed to load sources:", error);
      this.setState({
        error: "Failed to load sources. Please check your connection.",
        isLoadingSources: false,
      });
    }
  }

  private async loadArticles(sourceId?: string) {
    // If sourceId is explicitly passed, use it. Otherwise use state.
    // null means "All Sources" (no filter)
    const selectedSource = sourceId !== undefined ? sourceId : this.state.selectedSource;

    this.setState({ isLoading: true, error: null });
    try {
      // Pass undefined to getArticles if selectedSource is null (All Sources)
      const articles = await App.newsService.getArticles(
        100, 
        selectedSource || undefined
      );
      console.log("Loaded articles:", {
        count: articles.length,
        source: selectedSource || "All Sources",
      });
      this.setState({
        articles,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load articles:", error);
      this.setState({
        error: "Failed to load articles. Please check your connection.",
        isLoading: false,
      });
    }
  }

  private handleSourceChange = async (sourceId: string | null) => {
    this.setState({ selectedSource: sourceId });
    await this.loadArticles(sourceId || undefined);
  };

  private handleArticleTap = (article: Article) => {
    // Pass the webLauncher context from this page's context to the detail page
    this.navigationController.push(
      ArticleDetailPage,
      { article },
      this.context
    );
  };

  private handleRefresh = async () => {
    await this.loadArticles();
  };

  onRender(): void {
    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();

    console.log("Top Inset:", topInset, "Bottom Inset:", bottomInset);

    if (this.state.isLoadingSources || (this.state.isLoading && this.state.articles.length === 0)) {
      <view style={styles.container}>
        <view style={styles.loadingContainer}>
          <label style={styles.loadingText} value="Loading..." />
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

    console.log("Rendering NewsList with articles:", {
      articleCount: this.state.articles.length,
      sourcesCount: this.state.sources.length,
      selectedSource: this.state.selectedSource,
    });

    <view
      style={styles.container}
      paddingTop={topInset}
      paddingBottom={bottomInset}
    >
      <NewsList
        articles={this.state.articles}
        sources={this.state.sources}
        selectedSource={this.state.selectedSource}
        onArticleTap={this.handleArticleTap}
        onSourceChange={this.handleSourceChange}
        onRefresh={this.handleRefresh}
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
