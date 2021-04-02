import { DefaultIterableDiffer, TrackByFunction } from "@angular/core";
import { FileFlatNode } from "./file-data-source";

// Inspired by Angular Devtools diffing logic
export class FileFlatNodeDiffer {
    private _delegate: DefaultIterableDiffer<FileFlatNode>;

    removedFiles: any[] = [];

    constructor(trackBy?: TrackByFunction<FileFlatNode>) {
        trackBy = trackBy ?? ((_: number, item: FileFlatNode) => item.path);
        this._delegate = new DefaultIterableDiffer(trackBy);
    }

    updateWithDiff(fileNodesToUpdate: FileFlatNode[], latestFileNodes: FileFlatNode[]): void {
        const indexWasUpdated = new Map<number, boolean>();
        this._diff(fileNodesToUpdate)
            ._diff(latestFileNodes)
            ._updateMovedItems(indexWasUpdated, fileNodesToUpdate, latestFileNodes)
            ._updateNewItems(indexWasUpdated, fileNodesToUpdate)
            ._updateDeletedItems(indexWasUpdated, fileNodesToUpdate);
    }

    private _diff(fileNodes: FileFlatNode[]): this {
        this._delegate.diff(fileNodes);
        return this;
    }
    
    private _updateMovedItems(indexWasUpdated: Map<number, boolean>, fileNodesToUpdate: FileFlatNode[], latestFileNodes: FileFlatNode[]): this {
        this._delegate.forEachMovedItem(record => {
            const { currentIndex, previousIndex } = record;

            if (currentIndex === null || previousIndex === null) {
                return;
            }

            fileNodesToUpdate[currentIndex] = indexWasUpdated.get(previousIndex) ? {} as any : fileNodesToUpdate[previousIndex];

            Object.keys(latestFileNodes[currentIndex]).forEach(key => {
                if (currentIndex !== null) {
                    (fileNodesToUpdate[currentIndex] as any)[key] = (latestFileNodes[currentIndex] as any)[key];
                }
            });

            if (!indexWasUpdated.get(previousIndex)) {
                fileNodesToUpdate[previousIndex] = null as any;
            }

            indexWasUpdated.set(currentIndex, true);
        });

        return this;
    };

    private _updateNewItems(indexWasUpdated: Map<number, boolean>, fileNodesToUpdate: FileFlatNode[]): this {
        this._delegate.forEachAddedItem(record => {
            const { currentIndex, previousIndex } = record;

            if (currentIndex !== null && previousIndex === null) {
                fileNodesToUpdate[currentIndex] = record.item;
                indexWasUpdated.set(currentIndex, true);
            }
        });
        return this;
    }

    private _updateDeletedItems(indexWasUpdated: Map<number, boolean>, fileNodesToUpdate: FileFlatNode[]): this {
        this.removedFiles = [];
        this._delegate.forEachRemovedItem(record => {
            const { currentIndex, previousIndex } = record;
            this.removedFiles.push(record.item);

            if (previousIndex === null) {
                return;
            }

            if (currentIndex === null && !indexWasUpdated.get(previousIndex)) {
                fileNodesToUpdate[previousIndex] = null as any;;
            }
        });
    
        return this;
    }
}