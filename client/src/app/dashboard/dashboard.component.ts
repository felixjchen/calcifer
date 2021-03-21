import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaygroundService } from '../services/playground.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  loading = false;
  playgroundId: string;

  constructor(
    private _playgroundService: PlaygroundService,
    private _router: Router
  ) {}

  createDashboard(): void {
    this.loading = true;
    this._playgroundService.create().subscribe((response) => {
      this.playgroundId = response._id;
      this.loading = false;

      this._router.navigate(['/edit', `${this.playgroundId}`]);
    });
  }
}
