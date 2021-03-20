import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog-component.scss'],
})
export class ShareDialogComponent {
  editLink: string;
  serviceLink: string;
  constructor(@Inject(MAT_DIALOG_DATA) public _id: string) {
    this.editLink = `${window.location.origin}/edit/${_id}`;
    this.serviceLink = `${window.location.origin}/${_id}`;
  }
}
