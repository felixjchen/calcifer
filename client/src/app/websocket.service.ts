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
    let { username, password, host } = default_parameters;

    let params = new HttpParams();
    params.set('username', username);
    params.set('password', password);
    params.set('host', host);
    console.log(params.toString());
    this.socket = new ReconnectingWebSocket(`ws://${ssh_url}/?fe=yes`);
    let connection = new sharedb.Connection(this.socket as any);
  }
}
