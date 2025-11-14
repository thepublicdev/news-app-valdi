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
  private navigationController?: NavigationController;

  onCreate(): void {
    // Push the initial page after a small delay to ensure NavigationController is ready
    setTimeout(() => {
      // Pass the webLauncher context to the NewsListPage
      this.navigationController?.push(NewsListPage, {}, this.context);
    }, 0);
  }

  onRender(): void {
    <NavigationRoot>
      {$slot((navigationController: NavigationController) => {
        this.navigationController = navigationController;
        <view style={styles.container}>
          <view style={styles.header}>
            <label style={styles.headerTitle} value="News App" />
          </view>
        </view>;
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
