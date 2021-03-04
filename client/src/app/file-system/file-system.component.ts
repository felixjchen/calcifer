import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-file-system',
  templateUrl: './file-system.component.html',
  styleUrls: ['./file-system.component.scss'],
})
export class FileSystemComponent implements OnInit {
  @ViewChild('fileSystem', { static: true }) fileSystemDiv: ElementRef;
  constructor() {}

  ngOnInit(): void {
    let socket = io('https://project-calcifer.ml', {
      path: '/ssh/socket.io',
      query: {
        host: '68.183.197.185',
        username: 'root',
        password: 'KJ7rNn5yyz321321321z',
      },
    });

    socket.on('list', (list: string) => {
      this.fileSystemDiv.nativeElement.innerHTML = list;
    });
  }
}
