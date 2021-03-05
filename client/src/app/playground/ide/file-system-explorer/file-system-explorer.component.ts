import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FileDataSource, FileFlatNode } from './file-data-source';
import { FileNode } from 'src/app/interfaces/file-node';
import { FileStoreService } from '../../services/file-store.service';

declare const FileIcons: any;

@Component({
  selector: 'app-file-system-explorer',
  templateUrl: './file-system-explorer.component.html',
  styleUrls: ['./file-system-explorer.component.scss']
})
export class FileSystemExplorerComponent {
  @Input() set files(files: FileNode[]) {
    this.dataSource.update(files);
  }

  @Output() selectFile = new EventEmitter<FileNode>();

  fileIcons = FileIcons;

  readonly treeControl = new FlatTreeControl<FileFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  readonly dataSource = new FileDataSource(this.treeControl);
  hasChild = (_: number, node: any) => node.expandable;

  activeFileNode: FileFlatNode;

  onNodeClick(node: FileFlatNode): void {
    this.selectFile.emit(node.original);
    this.activeFileNode = node;
  }
}
