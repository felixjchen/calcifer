import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

  constructor() {
    this.socket = io('0.0.0.0:8000/68.183.197.185', {
      path: '/socket.io',
      query: {
        host: '68.183.197.185',
        username: 'root',
        password: 'KJ7rNn5yyz321321321z',
      },
    });
  }
}
