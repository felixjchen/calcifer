import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileNode } from 'src/app/interfaces/file-node';
import { MatTreeFlattener } from '@angular/material/tree';
import { FileFlatNodeDiffer } from './FileFlatNodeDiffer';
import { FileStoreService } from '../../services/file-store.service';

export interface FileFlatNode {
  filename: string;
  level: number;
  path: string;
  isDirectory: boolean;
  attrs: {
    longname: string;
  };
  original: FileNode;
  expandable: boolean;
}

export class FileDataSource extends DataSource<FileFlatNode> {
  flattenedData = new BehaviorSubject<FileFlatNode[]>([]);
  expandedData = new BehaviorSubject<FileFlatNode[]>([]);

  flatNodeByPath = new Map<string, FileFlatNode>();

  private _treeFlattener = new MatTreeFlattener(
    (node: any, level: number) => {
      const flatNode: FileFlatNode = {
        filename: node.filename,
        attrs: node.attrs,
        path: node.path,
        isDirectory: node.longname[0] === 'd',
        expandable: !!node.children && node.children.length > 0,
        original: node,
        level,
      };
      return flatNode;
    },
    (node) => (node ? node.level : -1),
    (node) => (node ? node.isDirectory : false),
    (node) => (node ? node.children : [])
  );

  private _subscriptions: Subscription[] = [];

  private _fileFlatNodeDiffer = new FileFlatNodeDiffer();

  constructor(
    private _treeControl: FlatTreeControl<FileFlatNode>,
    private _fileStore: FileStoreService
  ) {
    super();
  }

  get data(): FileFlatNode[] {
    return this.flattenedData.value;
  }

  update(files: FileNode[]): void {
    if (!files) {
      return;
    }

    const newFlattenedFiles = this._treeFlattener.flattenNodes(
      files
    ) as FileFlatNode[];
    let currentData = this.data;
    this._fileFlatNodeDiffer.updateWithDiff(currentData, newFlattenedFiles);
    currentData = currentData.filter((fileFlatNode) => fileFlatNode !== null);
    currentData.forEach((flatNode) =>
      this.flatNodeByPath.set(flatNode.path, flatNode)
    );
    this.flattenedData.next(this.data);
  }

  connect(collectionViewer: CollectionViewer): Observable<FileFlatNode[]> {
    const changed = this._treeControl.expansionModel.changed;
    this._subscriptions.push(
      changed.subscribe((change: SelectionChange<FileFlatNode>) => {
        (change.added ?? []).forEach((node) => this._toggleNode(node, true));
        (change.removed ?? [])
          .reverse()
          .forEach((node) => this._toggleNode(node, false));
      })
    );

    const changes = [
      collectionViewer.viewChange,
      this._treeControl.expansionModel.changed,
      this.flattenedData,
    ];
    return merge(...changes).pipe(
      map(() => {
        this.expandedData.next(
          this._treeFlattener.expandFlattenedNodes(this.data, this._treeControl)
        );
        return this.expandedData.value;
      })
    );
  }

  private _toggleNode(node: FileFlatNode, expand: boolean): void {
    const foundIndex = this.data.findIndex(
      (nodeToFind) => nodeToFind.path === node.path
    );

    if (foundIndex === -1 || !node.isDirectory || !expand) {
      return;
    }

    if (node.original.children !== undefined) {
      this._fileStore.expandedDirectories.add(node.path);
      return;
    }

    this._fileStore.getDirectoryByPath(
      node.original.path,
      (children: FileNode[]) => {
        node.original.children = children;
        this._treeControl.expand(node);
        const flatFiles = this._treeFlattener.flattenNodes(children);
        flatFiles.forEach((file) => (file.level = node.level + 1));
        // push new files in their corrrect positions
        const currentData = this.data;
        currentData.splice(foundIndex + 1, 0, ...flatFiles);
        this.flattenedData.next(currentData);
      }
    );
  }

  updateRootChildren(children: any): void {
    let currentChildren = this.data.filter((node) => node.level === 0);
    let currentChildrenIndexes: any = {};

    currentChildren.forEach((c) => {
      const foundIndex = this.data.findIndex(
        (nodeToFind) => nodeToFind.path === c.path
      );
      if (foundIndex !== -1) {
        currentChildrenIndexes[c.path] = foundIndex;
      }
    });

    const flatFiles = this._treeFlattener.flattenNodes(children);

    this._fileFlatNodeDiffer.updateWithDiff(currentChildren, flatFiles);
    currentChildren = currentChildren.filter(
      (fileFlatNode) => fileFlatNode !== null
    );

    const currentData = this.data;
    let newNodes: any[] = [];

    currentChildren.forEach((child) => {
      const index = currentChildrenIndexes[child.path];
      if (index !== undefined) {
        currentData[index] = child;
      } else {
        // hold off on pushing new nodes until we've rearranged the old ones
        newNodes.push(child);
      }
    });

    // now we can push the new nodes in
    newNodes.forEach((node) => {
      currentData.splice(0, 0, node);
    });

    this._fileFlatNodeDiffer.removedFiles.forEach((removed) => {
      if (currentChildrenIndexes[removed.path] === undefined) {
        console.warn('Tried to remove file thats already gone');
        return;
      }

      currentData.splice(currentChildrenIndexes[removed.path], 1);
      this.flatNodeByPath.delete(removed.path);
    });

    // todo: optimize this
    currentData.forEach((flatNode) =>
      this.flatNodeByPath.set(flatNode.path, flatNode)
    );
    this.flattenedData.next(currentData);
  }

  updateNodeChildren(node: FileFlatNode, children: any): void {
    const foundIndex = this.data.findIndex(
      (nodeToFind) => nodeToFind.path === node.path
    );
    if (foundIndex === -1) {
      return;
    }

    let currentChildren = getFlatNodeChildren(foundIndex, this.data);
    let currentChildrenIndexes: any = {};

    currentChildren.forEach((c) => {
      const foundIndex = this.data.findIndex(
        (nodeToFind) => nodeToFind.path === c.path
      );
      if (foundIndex !== -1) {
        currentChildrenIndexes[c.path] = foundIndex;
      }
    });

    const flatFiles = this._treeFlattener.flattenNodes(children);
    flatFiles.forEach((file) => (file.level = node.level + 1));

    this._fileFlatNodeDiffer.updateWithDiff(currentChildren, flatFiles);
    currentChildren = currentChildren.filter(
      (fileFlatNode) => fileFlatNode !== null
    );

    const currentData = this.data;
    let newNodes: any[] = [];

    currentChildren.forEach((child) => {
      const index = currentChildrenIndexes[child.path];
      if (index !== undefined) {
        currentData[index] = child;
      } else {
        // hold off on pushing new nodes until we've rearranged the old ones
        newNodes.push(child);
      }
    });

    // now we can push the new nodes in
    newNodes.forEach((node) => {
      currentData.splice(foundIndex + 1, 0, node);
    });

    this._fileFlatNodeDiffer.removedFiles.forEach((removed) => {
      if (currentChildrenIndexes[removed.path] === undefined) {
        console.warn('Tried to remove file thats already gone');
        return;
      }

      currentData.splice(currentChildrenIndexes[removed.path], 1);
      this.flatNodeByPath.delete(removed.path);
    });

    node.original.children = currentChildren.map((c) => c.original);

    // todo: optimize this
    currentData.forEach((flatNode) =>
      this.flatNodeByPath.set(flatNode.path, flatNode)
    );
    this.flattenedData.next(currentData);
  }

  disconnect(): void {
    this._subscriptions.forEach((s) => s.unsubscribe());
    this._subscriptions = [];
  }
}

const getFlatNodeChildren = (flatNodeIndex: number, nodes: FileFlatNode[]) => {
  const res = [];
  const flatNode = nodes[flatNodeIndex];
  let ptr = flatNodeIndex + 1;

  while (nodes[ptr] !== undefined && nodes[ptr].level > flatNode.level) {
    if (nodes[ptr].level === flatNode.level + 1) {
      res.push(nodes[ptr]);
    }
    ptr++;
  }

  return res;
};
