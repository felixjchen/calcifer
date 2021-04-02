import {
  Component,
  EventEmitter,
  Input,
  ViewChild,
  Output,
  OnInit,
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileDataSource, FileFlatNode } from './file-data-source';
import { FileNode } from 'src/app/interfaces/file-node';
import { SocketioService } from '../../services/socketio.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { FileStoreService } from '../../services/file-store.service';
import { timer, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';

declare const FileIcons: any;

@Component({
  selector: 'app-file-system-explorer',
  templateUrl: './file-system-explorer.component.html',
  styleUrls: ['./file-system-explorer.component.scss'],
})
export class FileSystemExplorerComponent {
  @ViewChild(ContextMenuComponent) basicMenu: ContextMenuComponent;
  @Input() treeControl: FlatTreeControl<FileFlatNode>;
  @Input() dataSource: FileDataSource;
  @Output() selectFile = new EventEmitter<FileNode>();

  fileIcons = FileIcons;
  constructor(private socketService: SocketioService, public fileStore: FileStoreService, private _dialog: MatDialog) {}

  isDirectory = (_: number, node: any) => node.isDirectory;
  isDirectoryContextMenu = (node: any) => node.isDirectory;

  onNodeClick(node: FileFlatNode): void {
    if (node.isDirectory) {
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
        this.fileStore.expandedDirectories.delete(node.path);
        return
      }
      this.treeControl.expand(node);
    } else {
      this.selectFile.emit(node.original);
    }
  }

  // Context Menu events
  startRename(file: FileFlatNode): void {
    const dialogRef = this._dialog.open(RenameDialogComponent, {
      width: '500px',
      data: { file },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newPath = file.path.split('/');
        newPath[newPath.length - 1] = result;
        this.socketService.emit('renameFile', {
          path: file.path,
          newPath: newPath.join('/'),
        });
      }
    });
  }

  delete(file: FileFlatNode): void {
    if (file.isDirectory) {
      this.socketService.emit('deleteDir', file.path);
    } else {
      this.socketService.emit('deleteFile', file.path);
    }
  }
  showMessage(message: any) {
    console.log(message);
  }
}
