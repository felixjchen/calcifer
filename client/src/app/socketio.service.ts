import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const urlParams = new URLSearchParams(window.location.search);
let host = urlParams.get('h');
const production = process.env.NETLIFY === 'true';

const url = production
  ? `https://project-calcifer.ml/${host}`
  : `0.0.0.0:8000/${host}`;
const path = production ? '/ssh/socket.io' : '/socket,io';

console.log(process.env.NETLIFY);
console.log({ url, path });
@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;

  constructor() {
    host = host ? host : '';

    this.socket = io(url, {
      path,
      query: {
        host,
        username: 'root',
        password: 'KJ7rNn5yyz321321321z',
      },
    });
  }
}
