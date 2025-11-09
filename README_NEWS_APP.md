# News App - Valdi Application

A cross-platform news application built with Valdi that fetches and displays news articles from NewsAPI.org.

## Features

- 📰 Browse top headlines from NewsAPI.org
- 🔐 Secure API key storage using Valdi's persistence module
- 📱 Cross-platform support (iOS, Android, macOS)
- 🖼️ Article images and detailed view
- 🔄 Pull to refresh functionality

## Prerequisites

1. **Valdi Framework** - Ensure you have Valdi installed and configured
2. **NewsAPI.org API Key** - Get a free API key from [https://newsapi.org/register](https://newsapi.org/register)

## Project Structure

```
news_app/
├── modules/
│   └── news_app/
│       ├── BUILD.bazel          # Build configuration with dependencies
│       ├── src/
│       │   ├── App.tsx          # Main application component
│       │   ├── services/
│       │   │   └── NewsAPIService.ts  # NewsAPI client service
│       │   └── components/
│       │       ├── APIKeyConfig.tsx   # API key configuration screen
│       │       ├── NewsList.tsx       # News articles list view
│       │       └── ArticleDetail.tsx  # Article detail view
│       └── res/                 # Resources (images, etc.)
├── BUILD.bazel
├── WORKSPACE
└── config.yaml
```

## Setup Instructions

### 1. Sync the Project

After cloning or making changes to dependencies, sync the project:

```bash
valdi projectsync
```

This will:
- Generate IDE configuration files
- Resolve dependencies
- Set up the build environment

### 2. Get Your NewsAPI Key

1. Visit [https://newsapi.org/register](https://newsapi.org/register)
2. Sign up for a free account
3. Copy your API key from the dashboard

### 3. Build and Run

#### For iOS:
```bash
valdi install ios
```

#### For Android:
```bash
valdi install android
```

#### For macOS:
```bash
valdi install macos
```

### 4. Configure the App

When you first launch the app:
1. You'll see the API Key Configuration screen
2. Enter your NewsAPI.org API key
3. Tap "Save API Key"
4. The app will fetch and display top headlines

## Development

### Hot Reload

For faster development, use hot reload to see changes instantly:

```bash
valdi hotreload
```

### Dependencies

The app uses the following Valdi modules:
- `valdi_core` - Core component framework
- `valdi_tsx` - TSX/JSX template elements
- `valdi_http` - HTTP client for API requests
- `persistence` - Persistent storage for API key

### Architecture

The app follows a component-based architecture:

1. **App.tsx** - Main component that:
   - Manages application state
   - Loads and saves API key using PersistentStore
   - Coordinates navigation between screens
   - Handles data fetching

2. **NewsAPIService.ts** - Service layer that:
   - Wraps the NewsAPI HTTP client
   - Provides methods to fetch top headlines
   - Handles API response parsing

3. **Components:**
   - **APIKeyConfig** - Collects and validates API key input
   - **NewsList** - Displays scrollable list of news articles
   - **ArticleDetail** - Shows full article details

## API Key Storage

The app uses Valdi's `persistence` module to securely store your API key locally. The key is:
- Stored in user-scoped storage
- Persists across app launches
- Can be updated from the configuration screen

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
bazel clean
valdi projectsync
```

### TypeScript Errors

The TypeScript compiler may show temporary errors for Valdi modules. These will resolve after running:
```bash
valdi projectsync
```

### No Articles Showing

1. Verify your API key is valid at [https://newsapi.org](https://newsapi.org)
2. Check your internet connection
3. Ensure your API key has not exceeded rate limits (free tier: 100 requests/day)
4. Check the console logs for error messages

### Hot Reload Not Working

Make sure the hot reload daemon is running:
```bash
valdi hotreload
```

## Features Explained

### API Key Configuration
- First-time setup screen
- Input validation
- Secure local storage
- Can be reconfigured later

### News List
- Displays top headlines from US news sources
- Shows article image, title, description, and source
- Tap any article to view details
- Pull to refresh for latest news

### Article Detail
- Full article view with image
- Shows source, author, and publish date
- Displays full article content
- Back navigation to list view

## Extending the App

### Add Search Functionality

The `NewsAPIService` already includes a `searchNews` method. You can extend the UI to add a search feature:

```typescript
const results = await newsService.searchNews('technology');
```

### Change News Category

Modify the `loadNews` method in `App.tsx` to fetch different categories:

```typescript
const articles = await this.newsService.getTopHeadlines('us', 'technology');
```

Available categories: business, entertainment, general, health, science, sports, technology

### Add More Countries

Change the country parameter:

```typescript
const articles = await this.newsService.getTopHeadlines('gb'); // UK news
```

## Resources

- [Valdi Documentation](https://github.com/Snapchat/Valdi/tree/main/docs)
- [NewsAPI Documentation](https://newsapi.org/docs)
- [Valdi Discord Community](https://discord.gg/uJyNEeYX2U)

## License

This example application is provided as-is for educational purposes.
