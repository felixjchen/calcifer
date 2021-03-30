import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileFlatNode } from '../file-data-source';

@Component({
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.scss']
})
export class RenameDialogComponent {
  model: string;
  constructor(public dialogRef: MatDialogRef<RenameDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { file: FileFlatNode }) {
    this.model = data.file.filename;
  }
}
