import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import * as sharedb from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { environment } from '../environments/environment';
const { path, ssh_url, default_parameters } = environment;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket: ReconnectingWebSocket;
  constructor() {
    let config = default_parameters;
    let params = new HttpParams({ fromObject: config });

    this.socket = new ReconnectingWebSocket(
      `ws://${ssh_url}/${params.toString()}`
    );
    let connection = new sharedb.Connection(this.socket as any);

    console.log(this.socket, connection);
  }
}
