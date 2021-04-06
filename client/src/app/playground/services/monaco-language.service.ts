import { Injectable } from '@angular/core';

declare const monaco: any;

@Injectable({
  providedIn: 'root',
})
export class MonacoLanguageService {
  languageMap: { [ext: string]: string } = {};

  init(): void {
    if (Object.keys(this.languageMap).length !== 0) {
      return;
    }
    monaco.languages
      .getLanguages()
      .forEach((language: { id: string; extensions: string[] }) => {
        language.extensions.forEach(
          (ext: string) => (this.languageMap[ext] = language.id)
        );
      });
    //https://stackoverflow.com/questions/56954280/monaco-editor-how-to-disable-errors-typescript
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }

  getMonacoLanguageForFile(filename: string): string {
    try {
      const ext = filename.split('.').slice(-1)[0];
      return this.languageMap[`.${ext}`];
    } catch {
      return 'plaintext';
    }
  }
}
