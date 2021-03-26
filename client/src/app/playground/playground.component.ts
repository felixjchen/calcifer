import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileNode } from '../interfaces/file-node';
import { MenuButton } from '../interfaces/menu-button';
import { SocketioService } from '../socketio.service';
import { FileStoreService } from './services/file-store.service';
import { RouteParamStoreService } from './services/route-param-store.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit, OnDestroy {
  menuButtons: MenuButton[] = [
    {
      name: 'file-system-explorer',
      matIcon: 'content_copy',
    },
    {
      name: 'search',
      matIcon: 'search',
    },
    {
      name: 'settings',
      matIcon: 'settings',
    },
  ];

  activeMenu: MenuButton = this.menuButtons[0];
  files: FileNode[] = [];

  matches: string[] = [];

  handleMenuSelection(menu: MenuButton): void {
    this.activeMenu = menu;

    switch (menu.name) {
      case 'file-system-explorer':
        break;
      case 'search':
        break;
      case 'settings':
        break;
      default:
        break;
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _routeParamStore: RouteParamStoreService,
    private _socketService: SocketioService,
    private _fileStore: FileStoreService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      let { _id } = params;
      this._routeParamStore.playgroundId$.next(_id);

      this._socketService.init(_id);
      this._socketService.on('list', (files: FileNode[]) => {
        this.files = files;
      });

      this._socketService.on('searchResult', (result: { matches: string[]}) => {
        this.matches = result.matches;
      });

      this._fileStore.init();
    });
  }

  ngOnDestroy(): void {
    this._socketService.disconnect();
  }

  selectFromExistingFiles(path: string): void {
    const file = searchFileSystemTree(this.files, `/root${path.slice(1)}`);
    if (!file) {
      console.warn('could not find file at path ' + path);
      return;
    }

    this.selectFile(file);
  }

  selectFile(file: FileNode): void {
    this._socketService.emit('getFile', file);
  }
}

const searchFileSystemTree = (files: FileNode[] = [], path: string): FileNode | null => {
  // todo(aleksanderbodurri): optimize this traversal
  for (const file of files) {
    if (file.path === path) {
      return file;
    }

    const found = searchFileSystemTree(file.children, path);
    if (found) {
      return found;
    }
  }

  return null;
}