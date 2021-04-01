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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { timer, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';

declare const FileIcons: any;

@Component({
  selector: 'app-file-system-explorer',
  templateUrl: './file-system-explorer.component.html',
  styleUrls: ['./file-system-explorer.component.scss'],
})
export class FileSystemExplorerComponent implements OnInit {
  @ViewChild(ContextMenuComponent) basicMenu: ContextMenuComponent;
  @Input() set files(files: FileNode[]) {
    this.dataSource.update(files);
  }
  @Output() selectFile = new EventEmitter<FileNode>();

  fileIcons = FileIcons;
  listSubscription: Subscription;
  constructor(
    private socketService: SocketioService,
    public fileStore: FileStoreService,
    private _dialog: MatDialog
  ) {}

  readonly treeControl = new FlatTreeControl<FileFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  readonly dataSource = new FileDataSource(this.treeControl);

  // Although polling is inefficient, it will provide a better user experience, especially when the OS is changing the FS on its on, causing no updates to be pushed out.
  ngOnInit() {
    this.listSubscription = timer(0, 10 * 1000).subscribe(() => {
      this.socketService.socket.emit('getList');
    });
  }
  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  isDirectory = (_: number, node: any) => node.isDirectory;
  isDirectoryContextMenu = (node: any) => node.isDirectory;

  onNodeClick(node: FileFlatNode): void {
    // We don't want to fetch directories
    if (!node.isDirectory) {
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
