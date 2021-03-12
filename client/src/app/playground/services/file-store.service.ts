import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { File } from 'src/app/interfaces/file';
// import { FileNode } from 'src/app/interfaces/file-node';

@Injectable({
  providedIn: 'root',
})
export class FileStoreService implements OnInit {
  selectedFile$ = new BehaviorSubject<File | null>(null);

  // isSelectedFile(fileNode: FileNode): boolean {
  //   if (this.selectedFile$.value === null) {
  //     return false;
  //   }
  //   return this.selectedFile$.value.node.path === fileNode.path;
  // }

  // get file(): File | null {
  //   return this.selectedFile$.value;
  // }

  constructor() {}

  ngOnInit() {}
}
