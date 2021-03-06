import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteParamStoreService implements OnInit {
  playgroundId$ = new BehaviorSubject<string | null>(null);

  constructor() {}

  ngOnInit() {}
}
