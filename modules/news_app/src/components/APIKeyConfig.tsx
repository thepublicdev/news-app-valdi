import { StatefulComponent } from 'valdi_core/src/Component';
import { Label, View, TextField } from 'valdi_tsx/src/NativeTemplateElements';
import { Style } from 'valdi_core/src/Style';
import { systemFont, systemBoldFont } from 'valdi_core/src/SystemFont';

interface State {
  apiKey: string;
  isSaving: boolean;
}

interface ViewModel {
  onApiKeySaved: (apiKey: string) => void;
  initialApiKey?: string;
}

export class APIKeyConfig extends StatefulComponent<ViewModel, {}> {
  state: State = {
    apiKey: this.viewModel.initialApiKey || '',
    isSaving: false,
  };

  private handleTextChange = (event: { text: string }) => {
    this.setState({ apiKey: event.text });
  };

  private handleSave = () => {
    const trimmedKey = this.state.apiKey.trim();
    if (trimmedKey.length > 0) {
      this.setState({ isSaving: true });
      this.viewModel.onApiKeySaved(trimmedKey);
    }
  };

  onRender(): void {
    const canSave = this.state.apiKey.trim().length > 0 && !this.state.isSaving;
    
    <view style={styles.container}>
      <label style={styles.title} value="NewsAPI Configuration" />
      <label style={styles.subtitle} value="Enter your NewsAPI.org API key to get started" />
      
      <view style={styles.inputContainer}>
        <textfield
          style={styles.input}
          value={this.state.apiKey}
          placeholder="Enter your API key"
          onChange={this.handleTextChange}
          autocapitalization="none"
          autocorrection="none"
        />
      </view>

      <view 
        style={canSave ? styles.button : styles.buttonDisabled}
        onTap={canSave ? this.handleSave : undefined}
      >
        <label style={styles.buttonText} value={this.state.isSaving ? 'Saving...' : 'Save API Key'} />
      </view>

      <label style={styles.helpText} value="Don't have an API key? Get one free at newsapi.org" />
    </view>;
  }
}

const styles = {
  container: new Style<View>({
    padding: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
  }),
  title: new Style<Label>({
    font: systemBoldFont(28),
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  }),
  subtitle: new Style<Label>({
    font: systemFont(16),
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    numberOfLines: 0,
  }),
  inputContainer: new Style<View>({
    marginBottom: 24,
  }),
  input: new Style<TextField>({
    height: 50,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    font: systemFont(16),
    backgroundColor: '#f9f9f9',
  }),
  button: new Style<View>({
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  }),
  buttonDisabled: new Style<View>({
    height: 50,
    backgroundColor: '#cccccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  }),
  buttonText: new Style<Label>({
    font: systemBoldFont(17),
    color: 'white',
  }),
  helpText: new Style<Label>({
    font: systemFont(14),
    color: '#999999',
    textAlign: 'center',
    numberOfLines: 0,
  }),
};
