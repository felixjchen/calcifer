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
      imageSrc: 'assets/logos/cib-kubernetes.svg',
      label: 'Kubernetes (~2min)',
    },
    {
      type: 'dind',
      imageSrc: 'assets/logos/cib-docker.svg',
      label: 'Docker',
    },
    {
      type: 'c',
      imageSrc: 'assets/logos/cib-c.svg',
      label: 'C/C++',
    },
    {
      type: 'go',
      imageSrc: 'assets/logos/cib-go.svg',
      label: 'Go',
    },
    {
      type: 'rust',
      imageSrc: 'assets/logos/cib-rust.svg',
      label: 'Rust',
    },
    {
      type: 'python',
      imageSrc: 'assets/logos/cib-python.svg',
      label: 'Python',
    },
    {
      type: 'node',
      imageSrc: 'assets/logos/cib-node-js.svg',
      label: 'Node.js',
    },
    {
      type: 'react',
      imageSrc: 'assets/logos/cib-react.svg',
      label: 'React',
    },
    {
      type: 'vue',
      imageSrc: 'assets/logos/cib-vue-js.svg',
      label: 'Vue.js',
    },
    {
      type: 'angular',
      imageSrc: 'assets/logos/cib-angular.svg',
      label: 'Angular',
    },
  ];

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
