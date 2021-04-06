import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileNode } from '../interfaces/file-node';
import { MenuButton } from '../interfaces/menu-button';
import { SocketioService } from './services/socketio.service';
import { FileStoreService } from './services/file-store.service';
import { RouteParamStoreService } from './services/route-param-store.service';
import { ActivatedRoute } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  FileDataSource,
  FileFlatNode,
} from './ide/file-system-explorer/file-data-source';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaygroundService } from '../services/playground.service';

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

  treeControl = new FlatTreeControl<FileFlatNode>(
    (node) => node.level,
    (node) => node.isDirectory
  );
  dataSource = new FileDataSource(this.treeControl, this._fileStore);

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
    private _playgroundService: PlaygroundService,
    private _route: ActivatedRoute,
    private _routeParamStore: RouteParamStoreService,
    private _socketService: SocketioService,
    private _fileStore: FileStoreService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      let { _id } = params;

      // Bump MongoDB
      this._playgroundService.bump(_id).subscribe(() => {});
      // Other components need this route ID
      this._routeParamStore.playgroundId$.next(_id);
      this._socketService.init(_id);
      this._fileStore.init();

      this._socketService.once('directoryList', (files: FileNode[]) => {
        this.dataSource.update(files);
      });

      this._socketService.emit('getDirectoryList');

      this._socketService.on(
        'searchResult',
        (result: { matches: string[] }) => {
          this.matches = result.matches;
        }
      );

      // Although polling is inefficient, it will provide a better user experience, especially when the OS is changing the FS on its on, causing no updates to be pushed out.
      timer(0, 2000).subscribe(() => {
        this.refresh();
      });

      this._socketService.on(
        'visibleDirectoryLists',
        (res: { path: string; files: FileNode[] }[] = []) => {
          res.forEach(({ path, files }) => {
            if (path === '/root') {
              this.dataSource.updateRootChildren(files);
              return;
            }

            const node = this.dataSource.data.find(
              (flatNode) => flatNode.path === path
            );
            if (node) {
              this.dataSource.updateNodeChildren(node, files);
            }
          });
        }
      );

      // Error snack bar
      this._socketService.on('backendErrorMessage', (error_message: string) => {
        this._snackBar.open(error_message, 'Close', {
          duration: 5 * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    });
  }

  refresh(): void {
    this._socketService.emit('getVisibleDirectoryLists', [
      ...this._fileStore.expandedDirectories,
    ]);
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

const searchFileSystemTree = (
  files: FileNode[] = [],
  path: string
): FileNode | null => {
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
};
