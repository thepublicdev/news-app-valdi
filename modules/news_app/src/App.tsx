import { Component } from 'valdi_core/src/Component';
import { Label, View } from 'valdi_tsx/src/NativeTemplateElements';
import { Style } from 'valdi_core/src/Style';
import { systemBoldFont } from 'valdi_core/src/SystemFont';
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

const styles = {
  container: new Style<View>({
    width: '100%',
    height: '100%',
    backgroundColor: '#007AFF',
    flexDirection: 'column',
  }),
  header: new Style<View>({
    padding: 16,
    alignItems: 'center',
  }),
  headerTitle: new Style<Label>({
    font: systemBoldFont(20),
    color: 'white',
  }),
};
