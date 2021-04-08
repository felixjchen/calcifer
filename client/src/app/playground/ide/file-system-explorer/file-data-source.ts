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

  private _getNodeIndexes(nodes: FileFlatNode[]): any {
    let nodeIndexes: any = {};

    nodes.forEach((c) => {
      const foundIndex = this.data.findIndex(
        (nodeToFind) => nodeToFind.path === c.path
      );
      if (foundIndex !== -1) {
        nodeIndexes[c.path] = foundIndex;
      }
    });

    return nodeIndexes;
  }

  updateRootChildren(children: any): void {
    let currentChildren = this.data.filter((node) => node.level === 0);
    let currentChildrenIndexes: any = {};
    const currentData = this.data;

    currentChildren.forEach((c) => {
      const foundIndex = this.data.findIndex(
        (nodeToFind) => nodeToFind.path === c.path
      );
      if (foundIndex !== -1) {
        currentChildrenIndexes[c.path] = foundIndex;
      }
    });

    const flatFiles = this._treeFlattener.flattenNodes(children);

    currentChildren = this._updateWithDiff(currentChildren, flatFiles);

    this._rearrangeOldFilesAndAddNewFiles(currentChildren, currentData, currentChildrenIndexes, () => this.data.filter((node) => node.level === 0))
        ._removeFiles(currentData);

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
    const currentData = this.data;

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

    currentChildren = this._updateWithDiff(currentChildren, flatFiles);

    this._rearrangeOldFilesAndAddNewFiles(currentChildren, currentData, currentChildrenIndexes, () => getFlatNodeChildren(foundIndex, this.data))
        ._removeFiles(currentData);

    node.original.children = currentChildren.map((c) => c.original);

    // todo: optimize this
    currentData.forEach((flatNode) =>
      this.flatNodeByPath.set(flatNode.path, flatNode)
    );
    this.flattenedData.next(currentData);
  }

  private _updateWithDiff(currentChildren: FileFlatNode[], flatFiles: FileFlatNode[]): FileFlatNode[] {
    this._fileFlatNodeDiffer.updateWithDiff(currentChildren, flatFiles);
    return currentChildren.filter(
      (fileFlatNode) => fileFlatNode !== null
    );
  }

  private _rearrangeOldFilesAndAddNewFiles(currentChildren: FileFlatNode[], currentData: FileFlatNode[], currentChildrenIndexes: { [path: string]: number }, getSiblings: Function): this {
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
    newNodes.forEach((node) => this._insertNodeIntoFlatTree(node, currentData, getSiblings()));
    return this;
  }

  private _insertNodeIntoFlatTree(flatNode: FileFlatNode, sortedFlatNodes: FileFlatNode[], siblings: FileFlatNode[]): void {
    // If new node has no siblings we don't have to bother with sorting logic
    if (siblings.length === 0) {
      const parentPath = flatNode.path.slice(0, flatNode.path.length - flatNode.filename.length - 1);
      const parentIndex = sortedFlatNodes.findIndex(nodeToFind => nodeToFind.path === parentPath);
      if (parent) {
        sortedFlatNodes.splice(parentIndex + 1, 0, flatNode);
      }
      return;
    }
  
    // If new node has siblings we need to determine where to insert the new node
  
    for (const sibling of siblings) {
      if (flatNode.filename < sibling.filename) {
        // insert above sibling
        const siblingIndex = sortedFlatNodes.findIndex(nodeToFind => nodeToFind.path === sibling.path);
        if (siblingIndex === -1) {
          console.warn(`Could not insert node at path ${flatNode.path}. Expected siblings but could not locate them.`)
          return;
        }
        sortedFlatNodes.splice(siblingIndex, 0, flatNode);
        return;
      }
    }
  
    // At this point we can be sure that our new node is at the bottom of the sibling list lexicographically.
    // insert below lowest sibling
    const lowestSiblingIndex = sortedFlatNodes.findIndex(nodeToFind => nodeToFind.path === siblings[siblings.length - 1].path);
    if (lowestSiblingIndex === -1) {
      console.warn(`Could not insert node at path ${flatNode.path}. Expected siblings but could not locate them.`)
      return;
    }
    
    // Slide pointer down if lowest sibling is expanded and has chidlren
    let ptr = lowestSiblingIndex + 1;
    while (sortedFlatNodes[ptr] !== undefined && sortedFlatNodes[ptr].level > flatNode.level) {
      ptr++;
    }
  
    sortedFlatNodes.splice(ptr, 0, flatNode);
  }

  private _removeFiles(currentData: FileFlatNode[]): this {
    this._fileFlatNodeDiffer.removedFiles.forEach((fileToRemove) => {
      const indexOfNodeToRemove = this.data.findIndex(nodeToFind => nodeToFind.path === fileToRemove.path);
      if (indexOfNodeToRemove === -1) {
        console.warn('Tried to remove file thats already gone');
        return;
      }

      this._removeFile(indexOfNodeToRemove, currentData);

      // todo: optimize this by recursively removing paths;
      this.flatNodeByPath.delete(fileToRemove.path);
    });
    return this;
  }

  private _removeFile(indexOfNodeToRemove: number, flatNodes: FileFlatNode[]): void {
    const nodeToRemove = flatNodes[indexOfNodeToRemove]
    let ptr = indexOfNodeToRemove;

    flatNodes.splice(ptr, 1);
    // todo: optimize to splice entire range;
    while (flatNodes[ptr] !== undefined && flatNodes[ptr].level >= nodeToRemove.level + 1 && flatNodes[ptr].path.startsWith(nodeToRemove.path)) {
      flatNodes.splice(ptr, 1);
    }
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

  // todo: optimize
  while (nodes[ptr] !== undefined && nodes[ptr].level > flatNode.level) {
    if (nodes[ptr].level === flatNode.level + 1 && nodes[ptr].path.startsWith(flatNode.path)) {
      res.push(nodes[ptr]);
    }
    ptr++;
  }

  return res;
};
