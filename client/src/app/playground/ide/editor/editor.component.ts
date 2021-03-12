import { Component, OnInit } from '@angular/core';
import { FileStoreService } from '../../services/file-store.service';
import { File } from '../../../interfaces/file';
import { MonacoLanguageService } from '../../services/monaco-language.service';
import { SocketioService } from '../../../socketio.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  editorOptions = {
    theme: 'vs-dark',
    automaticLayout: true,
    language: 'plaintext',
  };
  file: File = {} as any;
  editorModel: string = '';

  readonly THEME = 'vs-dark';

  constructor(
    private _fileStore: FileStoreService,
    private _monacoLanguageService: MonacoLanguageService,
    private _socketService: SocketioService
  ) {}

  ngOnInit(): void {
    this._fileStore.selectedFile$.subscribe((file: File | null) => {
      if (file !== null && file.content !== undefined) {
        this._monacoLanguageService.init();
        this.editorOptions = {
          theme: this.THEME,
          automaticLayout: true,
          language: this._monacoLanguageService.getMonacoLanguageForFile(
            file.node.filename
          ),
        };
        this.file = file;
        this.editorModel = this.file.content;
      }
    });

    // Sync with others
    this._socketService.socket.on('sendFileContent', (content: string) => {
      this.editorModel = content;
    });
  }

  // https://github.com/microsoft/monaco-editor/issues/432
  // https://github.com/atularen/ngx-monaco-editor/issues/133
  onInitEditor(editor: any) {
    editor.onDidChangeModelContent((e: any) => {
      // Only trigger if user types, not if JS loads
      if (!e.isFlush) {
        const content = editor.getModel().getValue();
        this._socketService.socket.emit(
          'writeFile',
          this.file.node.path,
          content
        );
      }
    });
  }
}
