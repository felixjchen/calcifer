import { Component, Inject } from '@angular/core';
import { RouteParamStoreService } from '../playground/services/route-param-store.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  _id: string;
  constructor(
    private _routeParamStore: RouteParamStoreService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._routeParamStore.playgroundId$.subscribe((_id) => {
      if (_id !== null) {
        this._id = _id;
      }
    });
  }

  openDialog() {
    this._dialog.open(ShareDialogComponent, { data: this._id });
  }
}
