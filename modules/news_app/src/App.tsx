import { Component } from 'valdi_core/src/Component';
import { NavigationRoot } from 'valdi_navigation/src/NavigationRoot';
import { NavigationController } from 'valdi_navigation/src/NavigationController';
import { $slot } from 'valdi_core/src/CompilerIntrinsics';
import { NewsAPIService } from './services/NewsAPIService';
import { NewsListPage } from './pages/NewsListPage';

/**
 * @ViewModel
 * @ExportModel
 */
export interface AppViewModel {}

/**
 * @Context
 * @ExportModel
 */
export interface AppComponentContext {
}

/**
 * @Component
 * @ExportModel
 */
export class App extends Component<AppViewModel, AppComponentContext> {
  public static newsService: NewsAPIService = new NewsAPIService();

  onRender(): void {
    <NavigationRoot>
      {$slot((navigationController: NavigationController) => {
        // Access the internal navigator from the controller
        const navigator = (navigationController as any).navigator;
        
        // Create the context with navigator
        const pageContext = {
          navigator: navigator,
        };
        
        // Render NewsListPage directly as the root
        <NewsListPage context={pageContext} />;
      })}
    </NavigationRoot>;
  }
}
