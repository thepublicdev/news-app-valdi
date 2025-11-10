import { Component } from 'valdi_core/src/Component';
import { Label, View, ImageView, ScrollView } from 'valdi_tsx/src/NativeTemplateElements';
import { Style } from 'valdi_core/src/Style';
import { systemFont, systemBoldFont } from 'valdi_core/src/SystemFont';
import { NewsArticle } from '../services/NewsAPIService';

interface ViewModel {
  articles: NewsArticle[];
  selectedCategory: string;
  onArticleTap: (article: NewsArticle) => void;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  onSearchTap: () => void;
}

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
];

export class NewsList extends Component<ViewModel> {
  onRender(): void {
    <view style={styles.container}>
      <view style={styles.categoryHeader}>
        <scroll style={styles.categoryScroll} horizontal={true}>
          <view style={styles.categoryContainer}>
            {CATEGORIES.map((category) => (
            <view
              key={category.id}
              style={
                this.viewModel.selectedCategory === category.id
                  ? styles.categoryPillActive
                  : styles.categoryPill
              }
              onTap={() => this.viewModel.onCategoryChange(category.id)}
            >
              <label
                style={
                  this.viewModel.selectedCategory === category.id
                    ? styles.categoryTextActive
                    : styles.categoryText
                }
                value={category.label}
              />
            </view>
          ))}
          </view>
        </scroll>
        <view style={styles.searchIconButton} onTap={this.viewModel.onSearchTap}>
          <label style={styles.searchIcon} value="🔍" />
        </view>
      </view>
      <scroll style={styles.articlesScroll}>
        {this.viewModel.articles.length === 0 ? (
          <view style={styles.emptyContainer}>
            <label style={styles.emptyText} value="No articles found" />
            <view style={styles.refreshButton} onTap={this.viewModel.onRefresh}>
              <label style={styles.refreshButtonText} value="Tap to Refresh" />
            </view>
          </view>
        ) : (
          this.viewModel.articles.map((article, index) => (
          <view 
            key={`article-${index}`} 
            style={styles.articleCard}
            onTap={() => this.viewModel.onArticleTap(article)}
          >
            {article.urlToImage && (
              <image 
                src={article.urlToImage} 
                style={styles.articleImage}
              />
            )}
            <view style={styles.articleContent}>
              <label style={styles.articleTitle} value={article.title} />
              {article.description && (
                <label style={styles.articleDescription} value={article.description} />
              )}
              <label style={styles.articleSource} value={article.source.name} />
            </view>
          </view>
        ))
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
  categoryHeader: new Style<View>({
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  }),
  categoryScroll: new Style<ScrollView>({
    width: '85%',
    backgroundColor: 'white',
  }),
  searchIconButton: new Style<View>({
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  }),
  searchIcon: new Style<Label>({
    font: systemFont(20),
  }),
  categoryContainer: new Style<View>({
    flexDirection: 'row',
    padding: 12,
  }),
  categoryPill: new Style<View>({
    backgroundColor: '#f0f0f0',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20,
    marginRight: 8,
  }),
  categoryPillActive: new Style<View>({
    backgroundColor: '#007AFF',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 20,
    marginRight: 8,
  }),
  categoryText: new Style<Label>({
    font: systemFont(14),
    color: '#333333',
  }),
  categoryTextActive: new Style<Label>({
    font: systemBoldFont(14),
    color: 'white',
  }),
  articlesScroll: new Style<ScrollView>({
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
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
};
