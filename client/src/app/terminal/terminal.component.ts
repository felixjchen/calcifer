import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { io } from 'socket.io-client';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: [
    './terminal.component.scss',
    '../../../node_modules/xterm/css/xterm.css',
  ],
})
export class TerminalComponent implements OnInit {
  @ViewChild('myTerminal', { static: true }) terminalDiv: ElementRef;

  public term: Terminal;
  public fitAddOn: FitAddon;

  constructor() {}

  ngOnInit(): void {
    // https://www.npmjs.com/package/xterm-addon-fit
    // https://stackoverflow.com/questions/53307998/integrate-xterm-js-to-angular
    this.term = new Terminal({ cursorBlink: true });
    this.fitAddOn = new FitAddon();
    this.term.loadAddon(this.fitAddOn);
    this.term.open(this.terminalDiv.nativeElement);
    this.term.writeln('Welcome to xterm.js');
    this.fitAddOn.fit();

    let socket = io('0.0.0.0:8000', {
      path: '/socket.io',
    });
    socket.on('connect', () => {
      this.term.write('\r\n*** Connected to backend ***\r\n');
    });

    // Browser -> Backend
    this.term.onKey((ev) => {
      socket.emit('data', ev.key);
    });

    // Backend -> Browser
    socket.on('data', (data: string) => {
      this.term.write(data);
    });

    socket.on('disconnect', () => {
      this.term.write('\r\n*** Disconnected from backend ***\r\n');
    });
  }
}
