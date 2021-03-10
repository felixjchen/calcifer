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
import { FileStoreService } from '../../services/file-store.service';
import { ContextMenuComponent } from 'ngx-contextmenu';

declare const FileIcons: any;

@Component({
  selector: 'app-file-system-explorer',
  templateUrl: './file-system-explorer.component.html',
  styleUrls: ['./file-system-explorer.component.scss'],
})
export class FileSystemExplorerComponent {
  @Input() set files(files: FileNode[]) {
    this.dataSource.update(files);
  }
  @Output() selectFile = new EventEmitter<FileNode>();

  @ViewChild(ContextMenuComponent) basicMenu: ContextMenuComponent;

  fileIcons = FileIcons;
  activeFileNode: FileFlatNode;

  readonly treeControl = new FlatTreeControl<FileFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  readonly dataSource = new FileDataSource(this.treeControl);

  isDirectory = (_: number, node: any) => node.isDirectory;
  isDirectoryContextMenu = (node: any) => node.isDirectory;

  onNodeClick(node: FileFlatNode): void {
    this.activeFileNode = node;
    // We don't want to fetch directories
    if (!node.isDirectory) {
      this.selectFile.emit(node.original);
    }
  }
  showMessage(message: any) {
    console.log(message);
  }
}
