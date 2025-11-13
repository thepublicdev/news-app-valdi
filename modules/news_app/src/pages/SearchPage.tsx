import { NavigationPageStatefulComponent } from "valdi_navigation/src/NavigationPageComponent";
import { NavigationPage } from "valdi_navigation/src/NavigationPage";
import {
  Label,
  View,
  ImageView,
  ScrollView,
  TextField,
} from "valdi_tsx/src/NativeTemplateElements";
import { Style } from "valdi_core/src/Style";
import { systemFont, systemBoldFont } from "valdi_core/src/SystemFont";
import { NewsArticle } from "../services/NewsAPIService";
import { App } from "../App";
import { ArticleDetailPage } from "./ArticleDetailPage";
import { Device } from "valdi_core/src/Device";

interface State {
  searchQuery: string;
  articles: NewsArticle[];
  isSearching: boolean;
  isLoadingMore: boolean;
  hasSearched: boolean;
  currentPage: number;
  hasMore: boolean;
}

@NavigationPage(module)
export class SearchPage extends NavigationPageStatefulComponent<{}, any> {
  state: State = {
    searchQuery: "",
    articles: [],
    isSearching: false,
    isLoadingMore: false,
    hasSearched: false,
    currentPage: 1,
    hasMore: true,
  };

  private handleSearchChange = (event: { text: string }) => {
    this.setState({ searchQuery: event.text });
  };

  private handleSearchSubmit = async () => {
    if (this.state.searchQuery.trim().length > 0) {
      this.setState({ isSearching: true, hasSearched: true, currentPage: 1 });
      try {
        const articles = await App.newsService.searchNews(
          this.state.searchQuery,
          1
        );
        this.setState({ 
          articles, 
          isSearching: false, 
          currentPage: 1,
          hasMore: articles.length >= 20
        });
      } catch (error) {
        console.error("Search failed:", error);
        this.setState({ articles: [], isSearching: false });
      }
    }
  };

  private handleLoadMore = async () => {
    if (this.state.isLoadingMore || !this.state.hasMore || this.state.searchQuery.trim().length === 0) {
      return;
    }

    this.setState({ isLoadingMore: true });
    try {
      const nextPage = this.state.currentPage + 1;
      const newArticles = await App.newsService.searchNews(
        this.state.searchQuery,
        nextPage
      );
      
      this.setState({ 
        articles: [...this.state.articles, ...newArticles],
        currentPage: nextPage,
        isLoadingMore: false,
        hasMore: newArticles.length >= 20
      });
    } catch (error) {
      console.error("Failed to load more search results:", error);
      this.setState({ isLoadingMore: false });
    }
  };

  private handleArticleTap = (article: NewsArticle) => {
    this.navigationController.push(ArticleDetailPage, { article }, {});
  };

  private handleBack = () => {
    this.navigationController.pop();
  };

  onRender(): void {
    const topInset = Device.getDisplayTopInset();
    const bottomInset = Device.getDisplayBottomInset();

    <view
      style={styles.container}
      marginTop={topInset}
      marginBottom={bottomInset}
    >
      <view style={styles.header}>
        <view style={styles.backButton} onTap={this.handleBack}>
          <label style={styles.backButtonText} value="← Back" />
        </view>
        {/* <label style={styles.headerTitle} value="Search News" /> */}
      </view>

      <view style={styles.searchContainer}>
        <textfield
          style={styles.searchInput}
          placeholder="Search for news..."
          value={this.state.searchQuery}
          onChange={this.handleSearchChange}
          autocorrection="none"
        />
        <view style={styles.searchButton} onTap={this.handleSearchSubmit}>
          <label style={styles.searchButtonText} value="Search" />
        </view>
      </view>

      <scroll 
        style={styles.resultsScroll}
        onScrollEnd={() => {
          if (this.state.hasMore && !this.state.isLoadingMore && this.state.articles.length > 0) {
            this.handleLoadMore();
          }
        }}
      >
        {this.state.isSearching ? (
          <view style={styles.centerContainer}>
            <label style={styles.messageText} value="Searching..." />
          </view>
        ) : !this.state.hasSearched ? (
          <view style={styles.centerContainer}>
            <label
              style={styles.messageText}
              value="Enter a search term to find news articles"
            />
          </view>
        ) : this.state.articles.length === 0 ? (
          <view style={styles.centerContainer}>
            <label
              style={styles.messageText}
              value="No articles found for your search"
            />
          </view>
        ) : (
          <view style={styles.resultsContainer}>
            {this.state.articles.map((article, index) => (
              <view
                key={`article-${index}`}
                style={styles.articleCard}
                onTap={() => this.handleArticleTap(article)}
              >
                {article.urlToImage && (
                  <image src={article.urlToImage} style={styles.articleImage} />
                )}
                <view style={styles.articleContent}>
                  <label style={styles.articleTitle} value={article.title} />
                  {article.description && (
                    <label
                      style={styles.articleDescription}
                      value={article.description}
                    />
                  )}
                  <label
                    style={styles.articleSource}
                    value={article.source.name}
                  />
                </view>
              </view>
            ))}
            {this.state.isLoadingMore && (
              <view style={styles.loadingMoreContainer}>
                <label style={styles.loadingMoreText} value="Loading more results..." />
              </view>
            )}
            {!this.state.hasMore && this.state.articles.length > 0 && (
              <view style={styles.endOfListContainer}>
                <label style={styles.endOfListText} value="No more results" />
              </view>
            )}
          </view>
        )}
      </scroll>
    </view>;
  }
}

const styles = {
  container: new Style<View>({
    width: "100%",
    height: "100%",
    backgroundColor: "#007AFF",
    flexDirection: "column",
  }),
  header: new Style<View>({
    padding: 16,
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
  }),
  backButton: new Style<View>({
    marginRight: 16,
  }),
  backButtonText: new Style<Label>({
    font: systemBoldFont(16),
    color: "white",
  }),
  headerTitle: new Style<Label>({
    font: systemBoldFont(20),
    color: "white",
  }),
  searchContainer: new Style<View>({
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
  }),
  searchInput: new Style<TextField>({
    height: 44,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    font: systemFont(16),
    width: "70%",
    marginRight: 8,
  }),
  searchButton: new Style<View>({
    backgroundColor: "#007AFF",
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 8,
  }),
  searchButtonText: new Style<Label>({
    font: systemBoldFont(16),
    color: "white",
  }),
  resultsScroll: new Style<ScrollView>({
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  }),
  resultsContainer: new Style<View>({
    width: "100%",
  }),
  centerContainer: new Style<View>({
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
  }),
  messageText: new Style<Label>({
    font: systemFont(16),
    color: "#999999",
    textAlign: "center",
  }),
  articleCard: new Style<View>({
    backgroundColor: "white",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    boxShadow: "0 2 4 rgba(0, 0, 0, 0.1)",
  }),
  articleImage: new Style<ImageView>({
    width: "100%",
    height: 200,
    objectFit: "cover",
  }),
  articleContent: new Style<View>({
    padding: 16,
  }),
  articleTitle: new Style<Label>({
    font: systemBoldFont(18),
    color: "#1a1a1a",
    marginBottom: 8,
    numberOfLines: 3,
  }),
  articleDescription: new Style<Label>({
    font: systemFont(14),
    color: "#666666",
    marginBottom: 8,
    numberOfLines: 3,
  }),
  articleSource: new Style<Label>({
    font: systemFont(12),
    color: "#999999",
  }),
  loadingMoreContainer: new Style<View>({
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  }),
  loadingMoreText: new Style<Label>({
    font: systemFont(14),
    color: "#999999",
  }),
  endOfListContainer: new Style<View>({
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  }),
  endOfListText: new Style<Label>({
    font: systemFont(14),
    color: "#999999",
  }),
};
