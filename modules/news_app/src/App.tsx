import { StatefulComponent } from 'valdi_core/src/Component';
import { Label, View } from 'valdi_tsx/src/NativeTemplateElements';
import { Style } from 'valdi_core/src/Style';
import { systemBoldFont } from 'valdi_core/src/SystemFont';
import { NewsAPIService, NewsArticle } from './services/NewsAPIService';
import { APIKeyConfig } from './components/APIKeyConfig';
import { NewsList } from './components/NewsList';
import { ArticleDetail } from './components/ArticleDetail';

// Hardcoded API key - replace with your NewsAPI.org API key
const NEWSAPI_KEY = '37bd379b7c7e4280ad84f7e8d176e870';

/**
 * @ViewModel
 * @ExportModel
 */
export interface AppViewModel {}

/**
 * @Context
 * @ExportModel
 */
export interface AppComponentContext {}

interface State {
  apiKey: string | null;
  articles: NewsArticle[];
  selectedArticle: NewsArticle | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * @Component
 * @ExportModel
 */
export class App extends StatefulComponent<AppViewModel, AppComponentContext> {
  private newsService: NewsAPIService;

  state: State = {
    apiKey: NEWSAPI_KEY,
    articles: [],
    selectedArticle: null,
    isLoading: false,
    error: null,
  };

  constructor(renderer: any, viewModel: AppViewModel, context: AppComponentContext) {
    super(renderer, viewModel, context);
    this.newsService = new NewsAPIService(NEWSAPI_KEY);
  }

  onCreate(): void {
    console.log('News App starting...');
    this.loadNews();
  }

  private async loadNews() {
    this.setState({ isLoading: true, error: null });
    try {
      const articles = await this.newsService.getTopHeadlines('us');
      this.setState({ articles, isLoading: false });
    } catch (error) {
      console.error('Failed to load news:', error);
      this.setState({ 
        error: 'Failed to load news. Please check your API key and connection.' + error,
        isLoading: false 
      });
    }
  }

  private handleArticleTap = (article: NewsArticle) => {
    this.setState({ selectedArticle: article });
  };

  private handleBack = () => {
    this.setState({ selectedArticle: null });
  };

  private handleRefresh = async () => {
    await this.loadNews();
  };

  onRender(): void {
    // Show article detail view
    if (this.state.selectedArticle) {
      <view style={styles.container}>
        <ArticleDetail 
          article={this.state.selectedArticle}
          onBack={this.handleBack}
        />
      </view>;
      return;
    }

    // Show loading state
    if (this.state.isLoading) {
      <view style={styles.container}>
        <view style={styles.header}>
          <label style={styles.headerTitle} value="News App" />
        </view>
        <view style={styles.loadingContainer}>
          <label style={styles.loadingText} value="Loading news..." />
        </view>
      </view>;
      return;
    }

    // Show error state
    if (this.state.error) {
      <view style={styles.container}>
        <view style={styles.header}>
          <label style={styles.headerTitle} value="News App" />
        </view>
        <view style={styles.errorContainer}>
          <label style={styles.errorText} value={this.state.error} />
          <view style={styles.retryButton} onTap={this.handleRefresh}>
            <label style={styles.retryButtonText} value="Retry" />
          </view>
        </view>
      </view>;
      return;
    }

    // Show news list
    <view style={styles.container}>
      <view style={styles.header}>
        <label style={styles.headerTitle} value="News App" />
      </view>
      <NewsList 
        articles={this.state.articles}
        onArticleTap={this.handleArticleTap}
        onRefresh={this.handleRefresh}
      />
    </view>;
  }
}

const styles = {
  container: new Style<View>({
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  }),
  header: new Style<View>({
    padding: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  }),
  headerTitle: new Style<Label>({
    font: systemBoldFont(20),
    color: 'white',
  }),
  loadingContainer: new Style<View>({
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  loadingText: new Style<Label>({
    font: systemBoldFont(16),
    color: '#666666',
  }),
  errorContainer: new Style<View>({
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }),
  errorText: new Style<Label>({
    font: systemBoldFont(16),
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
    numberOfLines: 0,
  }),
  retryButton: new Style<View>({
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  }),
  retryButtonText: new Style<Label>({
    font: systemBoldFont(16),
    color: 'white',
  }),
};
