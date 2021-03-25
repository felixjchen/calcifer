import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog-component.scss'],
})
export class ShareDialogComponent {
  editLink: string;
  serviceLink: string;
  constructor(@Inject(MAT_DIALOG_DATA) public _id: string) {
    let { domain } = environment;
    this.editLink = `${domain}/edit/${_id}`;
    this.serviceLink = `https://${_id}.${window.location.hostname}`;
  }
}
