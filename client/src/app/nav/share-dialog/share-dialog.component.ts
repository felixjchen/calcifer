import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { PlaygroundService } from '../../services/playground.service';

@Component({
  selector: 'share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog-component.scss'],
})
export class ShareDialogComponent {
  editLink: string;
  serviceLink: string;
  worker0Link: string;
  worker1Link: string;
  worker2Link: string;
  type: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public _id: string,
    private _playgroundService: PlaygroundService
  ) {
    let { domain } = environment;
    this.editLink = `${domain}/edit/${_id}`;
    this.serviceLink = `https://${_id}.${window.location.hostname}`;
    this.worker0Link = `https://${_id}-cluster-worker-0.${window.location.hostname}`;
    this.worker1Link = `https://${_id}-cluster-worker-1.${window.location.hostname}`;
    this.worker2Link = `https://${_id}-cluster-worker-2.${window.location.hostname}`;
    this._playgroundService.get(_id).subscribe(({ type }) => {
      console.log({ type });
      this.type = type;
    });
  }
}
