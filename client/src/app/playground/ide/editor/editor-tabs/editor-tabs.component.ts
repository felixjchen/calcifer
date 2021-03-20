import { Component } from '@angular/core';
import { FileStoreService } from 'src/app/playground/services/file-store.service';
import { File } from 'src/app/interfaces/file';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SocketioService } from 'src/app/socketio.service';

declare const FileIcons: any;

@Component({
  selector: 'app-editor-tabs',
  templateUrl: './editor-tabs.component.html',
  styleUrls: ['./editor-tabs.component.scss']
})
export class EditorTabsComponent {
  fileIcons = FileIcons;

  constructor(public fileStore: FileStoreService, private _socketService: SocketioService) { }

  get breadcrumbs(): string[] {
    const selectedFile = this.fileStore.selectedFile;
    if (selectedFile === null) {
      return [];
    }

    const [_root, ...breadcrumbs] = selectedFile.node.path.split('/');
    return breadcrumbs;
  }

  drop(event: CdkDragDrop<File[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.fileStore.fileTabs$.value, event.previousIndex, event.currentIndex);
    } else {
      this._socketService.socket.emit('getFile', event.item.data.original);
    }
  }
}
