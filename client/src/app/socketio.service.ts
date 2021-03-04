import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    let host = urlParams.get('h');
    host = host ? host : '';

    this.socket = io(`0.0.0.0:8000/${host}`, {
      path: '/socket.io',
      query: {
        host,
        username: 'root',
        password: 'KJ7rNn5yyz321321321z',
      },
    });
  }
}
