import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-file-system',
  templateUrl: './file-system.component.html',
  styleUrls: ['./file-system.component.scss'],
})
export class FileSystemComponent implements OnInit {
  @ViewChild('fileSystem', { static: true }) fileSystemDiv: ElementRef;

  constructor(private socketService: SocketioService) {}

  ngOnInit(): void {
    let { socket } = this.socketService;
    socket.on('list', (list: string) => {
      this.fileSystemDiv.nativeElement.innerHTML = list;
    });
  }
}
