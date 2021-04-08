import { Component } from '@angular/core';
import { RouteParamStoreService } from '../../services/route-param-store.service';
import { PlaygroundService } from '../../../services/playground.service';
import { SocketioService } from '../../services/socketio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  id: string;
  constructor(
    private _routeParam: RouteParamStoreService,
    private _socketService: SocketioService,
    private _playgroundService: PlaygroundService
  ) {
    this._routeParam.playgroundId$.subscribe((id) => {
      if (id) {
        this.id = id;
      }
    });
  }
  deletePlayground() {
    if (this.id) {
      // Delete container
      this._playgroundService.delete(this.id).subscribe(() => {
        // Force everyone to dashboard
        this._socketService.emit('destroy');
      });
    }
  }
}
