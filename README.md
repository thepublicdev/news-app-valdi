# News App - Valdi Demo

A cross-platform news application built with [Valdi](https://github.com/Snapchat/Valdi), demonstrating native iOS, Android, and macOS development with TypeScript. This app fetches and displays news articles from NewsAPI.org with search functionality and detailed article views.

## Features

- 📰 Browse latest news headlines
- 🔍 Search news articles by keyword
- 📱 Native performance on iOS, Android, and macOS
- 🎨 Clean, modern UI with navigation
- ⚡ Hot reload for rapid development
- 🔄 Pull-to-refresh functionality
- 📖 Detailed article view with images

## Tech Stack

- **[Valdi](https://github.com/Snapchat/Valdi)** - Cross-platform UI framework that compiles TypeScript to native code
- **TypeScript/TSX** - Type-safe development with React-like syntax
- **Bazel** - High-performance build system
- **NewsAPI.org** - News data source
- **Valdi HTTP** - Promise-based HTTP client for API requests
- **Valdi Navigation** - Native navigation stack

## Prerequisites

Before you begin, ensure you have:

1. **Valdi CLI** installed and available on your PATH
2. **Node.js** (v16 or later)
3. **Platform-specific tools:**
   - **iOS**: Xcode 14+
   - **Android**: Android Studio with SDK 33+
   - **macOS**: Xcode Command Line Tools

### Installing Valdi CLI

If you haven't installed Valdi yet:

```bash
# Clone the Valdi repository
git clone https://github.com/Snapchat/Valdi.git

# Navigate to the CLI directory
cd Valdi/npm_modules/cli

# Install the CLI globally
npm run cli:install
```

## Getting Started

### 1. Configure Your API Key

This app uses NewsAPI.org to fetch news articles. You'll need a free API key:

1. Get your API key at [NewsAPI.org](https://newsapi.org/register)
2. Open `modules/news_app/src/App.tsx`
3. Replace the API key on line 12:

```typescript
const NEWSAPI_KEY = 'your-api-key-here';
```

### 2. Initial Setup

```bash
# Set up the development environment
valdi dev_setup

# Sync project and generate IDE files (required after cloning)
valdi projectsync
```

### 3. Build and Run

Choose your target platform:

#### iOS
```bash
valdi install ios
```

#### Android
```bash
valdi install android
```

#### macOS
```bash
valdi install macos
```

### 4. Enable Hot Reload (Recommended)

For the best development experience, start hot reload in a separate terminal:

```bash
valdi hotreload
```

This enables instant updates without rebuilding when you save changes to your code.

## Development

### Project Structure

```
modules/news_app/
├── src/
│   ├── App.tsx                    # Main app component
│   ├── components/
│   │   ├── NewsList.tsx           # Reusable news list component
│   │   └── SearchNews.tsx         # Search input component
│   ├── pages/
│   │   ├── NewsListPage.tsx       # Home page with news feed
│   │   ├── ArticleDetailPage.tsx  # Article detail view
│   │   └── SearchPage.tsx         # Search results page
│   └── services/
│       └── NewsAPIService.ts      # API client service
├── BUILD.bazel                    # Build configuration
└── tsconfig.json                  # TypeScript configuration
```

### Key Commands

```bash
# Sync project (run after changing dependencies or BUILD files)
valdi projectsync

# Build specific target with Bazel
bazel build //modules/news_app:news_app

# Clean build cache (if builds seem stuck)
bazel clean

# Run tests
bazel test //modules/news_app:tests
```

### VSCode Integration

For the best IDE experience:

1. Run `valdi projectsync` to generate IDE configuration
2. Install recommended extensions (TypeScript, ESLint)
3. Set breakpoints and debug TypeScript code directly

## Architecture

### Component Lifecycle

Valdi components use a class-based pattern:

```typescript
class MyComponent extends Component {
  onCreate()   // Component initialization
  onMount()    // Called when mounted to view tree
  onRender()   // Returns the UI tree (required)
  onUpdate()   // Called when props/state change
  onUnmount()  // Cleanup before removal
}
```

### API Service Pattern

The `NewsAPIService` provides a clean interface for fetching news:

```typescript
// Fetch top headlines
await newsService.getTopHeadlines(country, category, pageSize, page)

// Search articles
await newsService.searchNews(query, pageSize, page)
```

### Navigation

Built with `valdi_navigation` for native navigation stacks:

```typescript
// Push a new page
navigationController.push(ArticleDetailPage, props, context)

// Pop back
navigationController.pop()
```

## Debugging

### Hermes Debugger

1. Start your app on a device/simulator
2. Open Chrome DevTools
3. Set breakpoints in your TypeScript code
4. See full debugging guide in Valdi docs: `/docs/docs/workflow-hermes-debugger.md`

### Common Issues

**Build fails**: Try `bazel clean` and `valdi projectsync`

**Hot reload not working**: Ensure you're running `valdi hotreload` and the app is connected

**API errors**: Verify your NewsAPI key is valid and has not exceeded rate limits

## Contributing

This is a demo application. Feel free to fork and modify for your own projects!

### Ideas for Enhancement

- [ ] Add category filtering (business, sports, tech, etc.)
- [ ] Implement favorites/bookmarks with local persistence
- [ ] Add dark mode support
- [ ] Implement infinite scroll/pagination
- [ ] Add article sharing functionality
- [ ] Cache articles for offline viewing
- [ ] Add unit and integration tests

## Resources

- **Valdi Documentation**: [GitHub](https://github.com/Snapchat/Valdi)
- **Valdi Discord**: [Join Community](https://discord.gg/uJyNEeYX2U)
- **NewsAPI Documentation**: [newsapi.org/docs](https://newsapi.org/docs)
- **API Reference**: Check `/docs/api/` in Valdi repository
- **Codelabs**: Step-by-step tutorials at `/docs/codelabs/`

## License

This demo application is open source. Please refer to the Valdi framework license for framework usage terms.

---

**Note for AI Assistants**: See [AGENTS.md](./AGENTS.md) for guidelines when working on this codebase.
