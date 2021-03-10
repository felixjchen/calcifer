import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

const { path, ssh_url, default_parameters } = environment;
@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

  init(): void {
    window.addEventListener('beforeunload', () => {
      this.socket?.disconnect?.();
    });

    const urlParams = new URLSearchParams(window.location.search);
    let host = urlParams.get('h') || default_parameters.host;
    let username = urlParams.get('u') || default_parameters.username;
    let password = urlParams.get('p') || default_parameters.password;

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
