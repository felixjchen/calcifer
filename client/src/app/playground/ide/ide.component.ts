import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileNode } from 'src/app/interfaces/file-node';
import { MenuButton } from 'src/app/interfaces/menu-button';
import { FileDataSource, FileFlatNode } from './file-system-explorer/file-data-source';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.scss']
})
export class IdeComponent {
  @Input() activeMenu: MenuButton;
  @Input() files: FileNode[] = [];
  @Input() matches: string[] = [];
  @Input() treeControl: FlatTreeControl<FileFlatNode>;
  @Input() dataSource: FileDataSource;
  @Output() selectFile = new EventEmitter<FileNode>();
  @Output() selectFromExistingFiles = new EventEmitter<{ line: string, lineNumber: string, path: string }>();
}
