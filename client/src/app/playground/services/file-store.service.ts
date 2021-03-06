import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { File } from 'src/app/interfaces/file';
import { FileNode } from 'src/app/interfaces/file-node';
import { SocketioService } from '../services/socketio.service';

const fileNodeEqual = (fileNodeA: FileNode, fileNodeB: FileNode) =>
  fileNodeA.path === fileNodeB.path;
const fileEqual = (fileA: File, fileB: File) =>
  fileNodeEqual(fileA.node, fileB.node);

@Injectable({
  providedIn: 'root',
})
export class FileStoreService {
  selectedFile$ = new BehaviorSubject<File | null>(null);
  fileTabs$ = new BehaviorSubject<File[]>([]);

  expandedDirectories = new Set<string>();

  constructor(private _socketService: SocketioService) { }

  init(): void {
    this.expandedDirectories.add('/root');
    this._socketService.socket.on('sendFile', (file: File) => {
      this.selectedFile = file;
    });
  }

  getDirectoryByPath(path: string, cb: (children: FileNode[]) => void): void {
    this._socketService.emit('getDirectoryChildren', path);
    this._socketService.once('directoryChildren', (children: FileNode[]) => { 
      this.expandedDirectories.add(path);
      cb(children);
    });
  }

  isSelectedFile(file: File | FileNode): boolean {
    if (this.selectedFile === null) {
      return false;
    }

    if ((file as File).content === undefined) {
      return fileNodeEqual(file as FileNode, this.selectedFile.node);
    }

    return fileEqual(file as File, this.selectedFile);
  }

  removeDirectory(directory: FileNode): void {
    const { path } = directory;
    let tabs = this.fileTabs$.value;
    tabs.forEach(tab => {
      if (tab.node.path.startsWith(path)) {
        this.removeFile(tab);
      }
    });
  }

  removeFile(file: File): void {
    let tabs = this.fileTabs$.value;
    const fileToRemoveIndex = tabs.findIndex((foundFile) =>
      fileEqual(foundFile, file)
    );

    if (fileToRemoveIndex === -1) {
      return;
    }

    const fileToRemove = tabs[fileToRemoveIndex];
    tabs = tabs.filter(
      (fileToFilter) => !fileEqual(fileToFilter, fileToRemove)
    );

    if (tabs.length === 0) {
      this.selectedFile = null;
      this.fileTabs$.next([]);
      return;
    }

    if (this.selectedFile && fileEqual(fileToRemove, this.selectedFile)) {
      const newFileToSelect =
        tabs[fileToRemoveIndex] || tabs[Math.min(fileToRemoveIndex - 1, 0)];
      this._socketService.emit('getFile', newFileToSelect.node);
    }

    this.fileTabs$.next(tabs);
  }

  set selectedFile(file: File | null) {
    this.selectedFile$.next(file);

    if (file === null) {
      return;
    }

    if (this.fileTabs$.value.find((foundFile) => fileEqual(foundFile, file))) {
      return;
    }

    this.fileTabs$.next([...this.fileTabs$.value, file]);
  }

  get selectedFile(): File | null {
    return this.selectedFile$.value;
  }
}
