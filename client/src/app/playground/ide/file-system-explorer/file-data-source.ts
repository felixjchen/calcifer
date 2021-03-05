import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { DefaultIterableDiffer } from "@angular/core";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FileNode } from "src/app/interfaces/file-node";
import { MatTreeFlattener } from '@angular/material/tree';

export interface FileFlatNode {
    filename: string;
    level: number;
    path: string;
    attrs: {
        longname: string;
    };
    original: FileNode;
    expandable: boolean;
}

export class FileDataSource extends DataSource<FileFlatNode> {
    flattenedData = new BehaviorSubject<FileFlatNode[]>([]);
    expandedData = new BehaviorSubject<FileFlatNode[]>([]);

    private _treeFlattener = new MatTreeFlattener(
        (node: FileNode, level: number) => {
            const flatNode: FileFlatNode = {
                filename: node.filename,
                attrs: node.attrs,
                path: node.path,
                expandable: !!node.children && node.children.length > 0,
                original: node,
                level,
            };
            return flatNode;
        },
        (node) => (node ? node.level : -1),
        (node) => (node ? node.expandable : false),
        (node) => (node ? node.children : [])
    );
    
     // Todo: implement diff logic on updates
    private _differ = new DefaultIterableDiffer((_: number, item: FileFlatNode) => item.path);

    constructor(private _treeControl: FlatTreeControl<FileFlatNode>) {
        super();
    }

    update(files: FileNode[]): void {
        if (!files) {
            return;
        }

        const newFlattenedFiles = this._treeFlattener.flattenNodes(files) as FileFlatNode[];

        const expandedNodes: any = {};
        this.flattenedData.value.forEach((node) => {
          expandedNodes[`${node.filename}#${node.attrs.longname}`] = this._treeControl.isExpanded(node);
        });

        this._treeControl.dataNodes = newFlattenedFiles;
        this.flattenedData.next(newFlattenedFiles);

        this.flattenedData.value.forEach(node => {
            if (expandedNodes[`${node.filename}#${node.attrs.longname}`]) {
                this._treeControl.expand(node);
            }
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<FileFlatNode[]> {
        const changes = [collectionViewer.viewChange, this._treeControl.expansionModel.changed, this.flattenedData];
        return merge(...changes).pipe(
            map(() => {
                this.expandedData.next(this._treeFlattener.expandFlattenedNodes(this.flattenedData.value, this._treeControl as any) as FileFlatNode[]);
                return this.expandedData.value;
            })
        );
    }

    disconnect(): void { }
}