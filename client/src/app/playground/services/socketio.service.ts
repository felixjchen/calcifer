import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

const { path, ssh_url, default_parameters } = environment;
@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

  constructor(private _router: Router, private _snackBar: MatSnackBar) {}

  emit(topic: string, payload: any): void {
    if (this.socket === undefined) {
      console.error(`Socket not connected. Can't emit to ${topic}`);
    }

    this.socket.emit(topic, payload);
  }

  on(topic: string, cb: Function): void {
    if (this.socket === undefined) {
      console.error(`Socket not connected. Can't subscribe to ${topic}`);
    }

    this.socket.on(topic, (...args: any) => cb(...args));
  }

  disconnect(): void {
    if (this.socket === undefined) {
      console.error(`Socket not connected. Can't disconnect.`);
    }
    this.socket.disconnect();
  }

  init(_id: string): void {
    window.addEventListener('beforeunload', () => {
      this.socket?.disconnect?.();
    });

    let host = _id;
    let { username, password } = default_parameters;
    let query = {
      host,
      username,
      password,
    };

    // Redo query
    // Stupid https://socket.io/docs/v3/client-initialization/#query
    if (this.socket) {
      this.socket.io.opts.query = query;
    }

    this.socket = io(`${ssh_url}/${host}`, {
      path,
      query,
    });

    this.on('ssh_error_connecting', () => {
      this._router.navigate(['/dashboard']).then(() => {
        this._snackBar.open(
          `Could not connect to playground ${host}`,
          `close`,
          {
            duration: 2000,
          }
        );
      });
    });
  }
}
