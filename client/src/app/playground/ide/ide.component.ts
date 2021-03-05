import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileNode } from 'src/app/interfaces/file-node';
import { MenuButton } from 'src/app/interfaces/menu-button';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.scss']
})
export class IdeComponent {
  @Input() activeMenu: MenuButton;
  @Input() files: FileNode[] = [];
  @Output() selectFile = new EventEmitter<FileNode>();
}
