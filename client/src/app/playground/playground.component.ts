import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileNode } from '../interfaces/file-node';
import { MenuButton } from '../interfaces/menu-button';
import { SocketioService } from './services/socketio.service';
import { FileStoreService } from './services/file-store.service';
import { RouteParamStoreService } from './services/route-param-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  FileDataSource,
  FileFlatNode,
} from './ide/file-system-explorer/file-data-source';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaygroundService } from '../services/playground.service';
import { environment } from '../../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { File } from '../interfaces/file';

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

  refresh$ = new Subject<void>();

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
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      let { _id } = params;

      // Bump MongoDB
      this._playgroundService.bump(_id).subscribe(() => {});
      this._playgroundService.get(_id).subscribe(
        () => {},
        (error) => {
          this.openSnackBar(error.error.failure);
          if (environment.production) {
            this._router.navigate(['/dashboard']);
          }
        }
      );

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

      this.refresh$.pipe(debounceTime(2000)).subscribe(() => {
        this.refresh();
      });

      this._socketService.on(
        'visibleDirectoryLists',
        (res: { path: string; files: FileNode[] }[] = []) => {
          res.forEach(({ path, files }) => {
            if (path === '/root') {
              this._cleanUpDeletedTabs(this.dataSource.updateRootChildren(files) ?? []);
              return;
            }

            const node = this.dataSource.data.find(
              (flatNode) => flatNode.path === path
            );
            if (node) {
              this._cleanUpDeletedTabs(this.dataSource.updateNodeChildren(node, files) ?? []);
            }
          });
          this.refresh$.next();
        }
      );
      this.refresh$.next();

      this._socketService.on('fileNotFound', (file: any) => this._fileStore.removeFile({ content: '', node: file } as File));

      // Error snack bar
      this._socketService.on('backendErrorMessage', (error_message: string) => {
        this.openSnackBar(error_message);
      });

      // Destroy
      this._socketService.on('destroy', () => {
        this.openSnackBar('Playground deleted');
        this._router.navigate(['/dashboard']);
      });
    });
  }

  private _cleanUpDeletedTabs(removedFiles: FileFlatNode[]): void {
    removedFiles.forEach(file => {
      if (file.isDirectory) {
        this._fileStore.removeDirectory(file.original);
      } else {
        this._fileStore.removeFile({ content: '', node: file.original } as File);
      }
    });
  }

  private openSnackBar = (message: string) => {
    this._snackBar.open(message, 'Close', {
      duration: 5 * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  };

  refresh(): void {
    this._socketService.emit('getVisibleDirectoryLists', [
      ...this._fileStore.expandedDirectories,
    ]);
  }

  ngOnDestroy(): void {
    this._socketService.disconnect();
  }

  selectFromExistingFiles(path: string): void {
    const file = this.dataSource.data.find(nodeToFind => nodeToFind.path === `/root${path.slice(1)}`)
    if (!file) {
      console.warn('could not find file at path ' + path);
      return;
    }

    this.selectFile(file.original);
  }

  selectFile(file: FileNode): void {
    this._socketService.emit('getFile', file);
  }
}
