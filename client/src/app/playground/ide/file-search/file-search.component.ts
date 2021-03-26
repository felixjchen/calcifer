import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SocketioService } from 'src/app/socketio.service';
@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  styleUrls: ['./file-search.component.scss']
})
export class FileSearchComponent implements OnInit, OnDestroy {
  @Input() set matches(matches: string[]) {
    this._reset();

    matches.forEach(matchResult => {
      const [path, lineNumber, line] = matchResult.split(':');
      if (path === undefined || lineNumber === undefined || line === undefined) {
        return;
      }

      if (this.matchMap[path] !== undefined) {
        this.matchMap[path].push({ line, lineNumber });
      } else {
        this.matchMap[path] = [{ line, lineNumber }];
      }
    })
  }

  @Output() selectFromExistingFiles = new EventEmitter<{ line: string, lineNumber: string, path: string }>();

  matchMap: { [path: string]: { line: string, lineNumber: string }[] } = {}
  expandedMap: { [path: string]: boolean } = {};
  keyword = '';
  lastClicked: string = '';

  $search = new Subject();
  subscriptions: Subscription[] = [];

  constructor(private _socketService: SocketioService) {}

  ngOnInit(): void {
    this.subscriptions = [this.$search.pipe(debounceTime(300)).subscribe(() => this.search())];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get matchForestRoots(): any {
    return Object.keys(this.matchMap);
  }

  isExpanded(path: string): boolean {
    if (this.expandedMap[path] === undefined) {
      this.expandedMap[path] = true;
    }

    return this.expandedMap[path];
  }

  selectFile($event: { line: string, lineNumber: string, path: string }): void {
    this.selectFromExistingFiles.emit($event);
  }

  private _reset(): void {
    this.matchMap = {};
    this.expandedMap = {};
  }

  search(): void {
    if (this.keyword === '') {
      this._reset();
      return;
    }

    this._socketService.emit('searchByKeyword', this.keyword);
  }

  onRootClick(path: string): void {
    this.expandedMap[path] = !this.expandedMap[path];
    this.lastClicked = path;
  }

  onNodeClick({path, line, lineNumber}:{ path: string, line: string, lineNumber: string}): void {
    this.selectFile({ path, line, lineNumber });
    this.lastClicked = `${path}#${lineNumber}`;
  }
}
