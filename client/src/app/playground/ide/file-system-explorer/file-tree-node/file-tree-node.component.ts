import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-tree-node',
  templateUrl: './file-tree-node.component.html',
  styleUrls: ['./file-tree-node.component.scss']
})
export class FileTreeNodeComponent implements OnInit {
  @Input() node: any;

  constructor() { }

  ngOnInit(): void {
  }

}
