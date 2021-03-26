import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

const { path, ssh_url, default_parameters } = environment;
@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

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
    this.socket.disconnect;
  }

  init(_id: string): void {
    window.addEventListener('beforeunload', () => {
      this.socket?.disconnect?.();
    });

    let host = _id;
    let { username, password } = default_parameters;

    this.socket = io(`${ssh_url}/${host}`, {
      path,
      query: {
        host,
        username,
        password,
      },
    });
  }
}
