import {
  Component,
  EventEmitter,
  Input,
  ViewChild,
  Output,
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileDataSource, FileFlatNode } from './file-data-source';
import { FileNode } from 'src/app/interfaces/file-node';
import { SocketioService } from '../../../socketio.service';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { timer, Subscription } from 'rxjs';

declare const FileIcons: any;

@Component({
  selector: 'app-file-system-explorer',
  templateUrl: './file-system-explorer.component.html',
  styleUrls: ['./file-system-explorer.component.scss'],
})
export class FileSystemExplorerComponent {
  @ViewChild(ContextMenuComponent) basicMenu: ContextMenuComponent;
  @Input() set files(files: FileNode[]) {
    this.dataSource.update(files);
  }
  @Output() selectFile = new EventEmitter<FileNode>();

  fileIcons = FileIcons;
  activeFileNode: FileFlatNode;
  listSubscription: Subscription;
  readonly treeControl = new FlatTreeControl<FileFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  readonly dataSource = new FileDataSource(this.treeControl);

  constructor(private socketService: SocketioService) {}

  // Although polling is inefficient, it will provide a better user experience, especially when the OS is changing the FS on its on, causing no updates to be pushed out.
  ngOnInit() {
    this.listSubscription = timer(0, 4000).subscribe(() => {
      this.socketService.socket.emit('getList');
    });
  }
  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  isDirectory = (_: number, node: any) => node.isDirectory;
  isDirectoryContextMenu = (node: any) => node.isDirectory;

  onNodeClick(node: FileFlatNode): void {
    this.activeFileNode = node;
    // We don't want to fetch directories
    if (!node.isDirectory) {
      this.selectFile.emit(node.original);
    }
  }

  // Context Menu events
  delete(file: FileFlatNode): void {
    if (file.isDirectory) {
      this.socketService.socket.emit('deleteDir', file.path);
    } else {
      this.socketService.socket.emit('deleteFile', file.path);
    }
  }
  showMessage(message: any) {
    console.log(message);
  }
}
