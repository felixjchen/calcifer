import { Component, OnInit } from '@angular/core';
import { FileStoreService } from '../../services/file-store.service';
import { File } from '../../../interfaces/file';
import { MonacoLanguageService } from '../../services/monaco-language.service';
import { SocketioService } from '../../services/socketio.service';
import { SharedbService } from '../../services/sharedb.service';
import { RouteParamStoreService } from '../../services/route-param-store.service';

import ShareDBMonaco from '../../../vendor/sharedb-monaco';
import { environment } from '../../../../environments/environment';

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
  file: any = {};
  editorModel: string = '';
  id: string;
  sharedbBinding: ShareDBMonaco;

  readonly THEME = 'vs-dark';

  constructor(
    public fileStore: FileStoreService,
    private _monacoLanguageService: MonacoLanguageService,
    private _socketService: SocketioService,
    private _shareDbService: SharedbService,
    private _routeParamStoreService: RouteParamStoreService
  ) {}

  ngOnInit(): void {
    // Subscribe to playground id
    this._routeParamStoreService.playgroundId$.subscribe(
      (id: string | null) => {
        if (id) {
          this.id = id;
        }
      }
    );

    // Subscribe to currently selected file
    this.fileStore.selectedFile$.subscribe((file: File | null) => {
      if (file === null) {
        this.file.content = undefined;
      }

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
  }

  // https://github.com/microsoft/monaco-editor/issues/432
  // https://github.com/atularen/ngx-monaco-editor/issues/133
  onInitEditor(editor: any) {
    try {
      if (this.file.node && this.id) {
        // Create sharedb document, if this is the first time
        const collection = this.id;
        const documentID = this.file.node.path;
        const content = this.file.content;

        // Create doc in docsync service
        this._shareDbService
          .create(collection, documentID, content)
          .subscribe(() => {
            // If previous binding.. close
            if (this.sharedbBinding) {
              this.sharedbBinding.close();
            }

            // New two way Monaco binding
            const options = {
              namespace: this.id,
              id: this.file.node.path,
              wsurl: environment.docsync_ws_url,
            };
            this.sharedbBinding = new ShareDBMonaco(options);
            this.sharedbBinding.on('ready', () => {
              this.sharedbBinding.add(editor, 'content');
            });
          });
      }
    } catch (err) {
      console.log('shareDB error', err);
    }
    editor.onDidChangeModelContent((e: any) => {
      // Only trigger if user types, not if JS loads
      if (!e.isFlush) {
        // Save to file on editor change
        const content = editor.getModel().getValue();
        this._socketService.socket.emit('writeFile', {
          path: this.file.node.path,
          content,
        });
      }
    });
  }
}
