import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  // I cant figure out this typing
  socket: any;

  constructor() {
    this.socket = io('0.0.0.0:8000/60411d3c0bf6417bc83924eb', {
      path: '/socket.io',
      query: {
        host: '68.183.197.185',
        username: 'root',
        password: 'KJ7rNn5yyz321321321z',
      },
    });
  }
}
