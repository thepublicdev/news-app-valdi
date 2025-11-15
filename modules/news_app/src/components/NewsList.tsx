import { Component } from 'valdi_core/src/Component';
import { Label, View, ImageView, ScrollView } from 'valdi_tsx/src/NativeTemplateElements';
import { Style } from 'valdi_core/src/Style';
import { systemFont, systemBoldFont } from 'valdi_core/src/SystemFont';
import { Article, Source } from '../services/NewsAPIService';

interface ViewModel {
  articles: Article[];
  sources: Source[];
  selectedSource: string | null;
  onArticleTap: (article: Article) => void;
  onSourceChange: (sourceId: string | null) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

export class NewsList extends Component<ViewModel> {
  onRender(): void {
    <view style={styles.container}>
      <view style={styles.sourceHeader}>
        <scroll style={styles.sourceScroll} horizontal={true}>
          <view style={styles.sourceContainer}>
            {/* All Sources tab */}
            <view
              key="all-sources"
              style={
                this.viewModel.selectedSource === null
                  ? styles.sourcePillActive
                  : styles.sourcePill
              }
              onTap={() => this.viewModel.onSourceChange(null)}
            >
              <label
                style={
                  this.viewModel.selectedSource === null
                    ? styles.sourceTextActive
                    : styles.sourceText
                }
                value="All Sources"
              />
            </view>
            
            {/* Individual source tabs */}
            {this.viewModel.sources.map((source) => (
            <view
              key={source.id}
              style={
                this.viewModel.selectedSource === source.id
                  ? styles.sourcePillActive
                  : styles.sourcePill
              }
              onTap={() => this.viewModel.onSourceChange(source.id)}
            >
              <label
                style={
                  this.viewModel.selectedSource === source.id
                    ? styles.sourceTextActive
                    : styles.sourceText
                }
                value={source.name}
              />
            </view>
          ))}
          </view>
        </scroll>
      </view>
      <scroll 
        style={styles.articlesScroll}
      >
        {this.viewModel.articles.length === 0 ? (
          <view style={styles.emptyContainer}>
            <label style={styles.emptyText} value="No articles found" />
            <view style={styles.refreshButton} onTap={this.viewModel.onRefresh}>
              <label style={styles.refreshButtonText} value="Tap to Refresh" />
            </view>
          </view>
        ) : (
          <view style={styles.articlesContainer}>
            {this.viewModel.articles.map((article, index) => (
              <view 
                key={`article-${index}`} 
                style={styles.articleCard}
                onTap={() => this.viewModel.onArticleTap(article)}
              >
                {article.imageUrl && (
                  <image 
                    src={article.imageUrl} 
                    style={styles.articleImage}
                  />
                )}
                <view style={styles.articleContent}>
                  <label style={styles.articleTitle} value={article.title} />
                  {article.description && (
                    <label style={styles.articleDescription} value={article.description} />
                  )}
                  <label style={styles.articleSource} value={article.source} />
                </view>
              </view>
            ))}
            
            {/* Load More button */}
            {this.viewModel.hasNextPage && !this.viewModel.isLoadingMore && (
              <view style={styles.loadMoreContainer}>
                <view style={styles.loadMoreButton} onTap={this.viewModel.onLoadMore}>
                  <label style={styles.loadMoreButtonText} value="Load More" />
                </view>
              </view>
            )}
            
            {/* Loading indicator */}
            {this.viewModel.isLoadingMore && (
              <view style={styles.loadingMoreContainer}>
                <label style={styles.loadingMoreText} value="Loading more articles..." />
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
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
  }),
  sourceHeader: new Style<View>({
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  }),
  sourceScroll: new Style<ScrollView>({
    width: '100%',
    backgroundColor: 'white',
  }),
  sourceContainer: new Style<View>({
    flexDirection: 'row',
    padding: 12,
  }),
  sourcePill: new Style<View>({
    backgroundColor: '#f0f0f0',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20,
    marginRight: 8,
  }),
  sourcePillActive: new Style<View>({
    backgroundColor: '#007AFF',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20,
    marginRight: 8,
  }),
  sourceText: new Style<Label>({
    font: systemFont(14),
    color: '#333333',
  }),
  sourceTextActive: new Style<Label>({
    font: systemBoldFont(14),
    color: 'white',
  }),
  articlesScroll: new Style<ScrollView>({
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  }),
  articlesContainer: new Style<View>({
    width: '100%',
  }),
  emptyContainer: new Style<View>({
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  emptyText: new Style<Label>({
    font: systemFont(18),
    color: '#999999',
    marginBottom: 20,
  }),
  refreshButton: new Style<View>({
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  }),
  refreshButtonText: new Style<Label>({
    font: systemBoldFont(16),
    color: 'white',
  }),
  articleCard: new Style<View>({
    backgroundColor: 'white',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    boxShadow: '0 2 4 rgba(0, 0, 0, 0.1)',
  }),
  articleImage: new Style<ImageView>({
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 12,
  }),
  articleContent: new Style<View>({
    padding: 16,
  }),
  articleTitle: new Style<Label>({
    font: systemBoldFont(18),
    color: '#1a1a1a',
    marginBottom: 8,
    numberOfLines: 3,
  }),
  articleDescription: new Style<Label>({
    font: systemFont(14),
    color: '#666666',
    marginBottom: 8,
    numberOfLines: 3,
  }),
  articleSource: new Style<Label>({
    font: systemFont(12),
    color: '#999999',
  }),
  loadMoreContainer: new Style<View>({
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  }),
  loadMoreButton: new Style<View>({
    backgroundColor: '#007AFF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 8,
  }),
  loadMoreButtonText: new Style<Label>({
    font: systemBoldFont(16),
    color: 'white',
  }),
  loadingMoreContainer: new Style<View>({
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  loadingMoreText: new Style<Label>({
    font: systemFont(14),
    color: '#999999',
  }),
};
