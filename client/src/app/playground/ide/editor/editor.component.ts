import { Component, OnInit } from '@angular/core';
import { FileStoreService } from '../../services/file-store.service';
import { File } from '../../../interfaces/file';
import { MonacoLanguageService } from '../../services/monaco-language.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editorOptions = {theme: 'vs-dark', automaticLayout: true, language: 'plaintext'};
  file: File = {} as any;

  editorModel: string = '';

  readonly THEME = 'vs-dark';

  constructor(private _fileStore: FileStoreService, private _monacoLanguageService: MonacoLanguageService) {}

  ngOnInit(): void {
    this._fileStore.selectedFile$.subscribe((file: File | null) => {      
      if (file !== null && file.content !== undefined) {
        this._monacoLanguageService.init();
        this.editorOptions = {
          theme: this.THEME,
          automaticLayout: true,
          language: this._monacoLanguageService.getMonacoLanguageForFile(file.node.filename)
        }
        this.file = file;
        this.editorModel = this.file.content;
      }
    });
  }
}
