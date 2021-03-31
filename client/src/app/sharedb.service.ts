import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import * as sharedb from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';

import { environment } from '../environments/environment';
const { path, ssh_url, default_parameters } = environment;

@Injectable({
  providedIn: 'root',
})
export class SharedbService {
  ws: ReconnectingWebSocket;
  connection: sharedb.Connection;

  constructor() {
    let config = default_parameters;
    let params = new HttpParams({ fromObject: config });

    this.ws = new ReconnectingWebSocket(`ws://${ssh_url}/${params.toString()}`);
    this.connection = new sharedb.Connection(this.ws as any);

    console.log(this.ws, this.connection);
  }

  append_to_doc(doc: sharedb.Doc, si: string) {
    // Update doc.data
    doc.fetch(() => {
      const end = doc.data.content.length;
      const op = [{ p: ['content', end], si }];
      try {
        doc.submitOp(op);
      } catch (e) {
        console.error(e.message);
      }
    });
  }
}
