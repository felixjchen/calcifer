import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaygroundService } from '../services/playground.service';

interface PlaygroundButton {
  imageSrc: string;
  type: string;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  loading = false;
  playgroundId: string;

  playgroundButtons: PlaygroundButton[] = [
    {
      type: 'kind',
      imageSrc: 'assets/logos/k8s.svg',
      label: 'Kubernetes (~2min)'
    },
    {
      type: 'dind',
      imageSrc: 'assets/logos/docker.png',
      label: 'Docker'
    },
    {
      type: 'c',
      imageSrc: 'assets/logos/The_C_Programming_Language_logo.svg',
      label: 'C/C++'
    },
    {
      type: 'go',
      imageSrc: 'assets/logos/Go_Logo_Blue.svg',
      label: 'Go'
    },
    {
      type: 'rust',
      imageSrc: 'assets/logos/rust-logo-blk.svg',
      label: 'Rust'
    },
    {
      type: 'python',
      imageSrc: 'assets/logos/python-powered-h.svg',
      label: 'Python'
    },
    {
      type: 'node',
      imageSrc: 'assets/logos/Node.js_logo.svg',
      label: 'Node.js'
    },
    {
      type: 'react',
      imageSrc: 'assets/logos/react.svg',
      label: 'React'
    },
    {
      type: 'vue',
      imageSrc: 'assets/logos/vue.svg',
      label: 'Vue.js'
    },
    {
      type: 'angular',
      imageSrc: 'assets/logos/angular.svg',
      label: 'Angular'
    },
  ]

  constructor(
    private _playgroundService: PlaygroundService,
    private _router: Router
  ) {}

  createDashboard(type: string): void {
    this.loading = true;
    this._playgroundService.create(type).subscribe((response) => {
      this.playgroundId = response._id;
      this.loading = false;

      this._router.navigate(['/edit', `${this.playgroundId}`]);
    });
  }
}
