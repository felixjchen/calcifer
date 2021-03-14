import { Component } from '@angular/core';
import { RouteParamStoreService } from '../playground/services/route-param-store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  _id: string;
  constructor(private _routeParamStore: RouteParamStoreService) {}

  ngOnInit(): void {
    this._routeParamStore.playgroundId$.subscribe((_id) => {
      if (_id !== null) {
        this._id = _id;
      }
    });
  }
}
