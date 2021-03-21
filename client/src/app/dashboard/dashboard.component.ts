import { Component } from '@angular/core';
import { PlaygroundService } from '../services/playground.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  loading = false;
  playgroundId: string;

  constructor(private _playgroundService: PlaygroundService) { }

  createDashboard(): void {
    this.loading = true;
    this._playgroundService.create().subscribe((response) => {
      this.playgroundId = response._id;
      this.loading = false;
    });
  }
}
