/// <reference types="resize-observer-browser" />
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SocketioService } from '../../../socketio.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: [
    './terminal.component.scss',
  ],
})
export class TerminalComponent implements OnInit, OnDestroy {
  @ViewChild('terminal', { static: true }) terminalDiv: ElementRef;

  public term: Terminal;
  public fitAddOn: FitAddon;

  private resizeObserver: ResizeObserver;
  private _resize$ = new Subject<void>();
  subscriptions: Subscription[] = [];

  constructor(private socketService: SocketioService, private _ngZone: NgZone) { }

  ngOnInit(): void {
    // https://www.npmjs.com/package/xterm-addon-fit
    // https://stackoverflow.com/questions/53307998/integrate-xterm-js-to-angular
    this.term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#1e1e1e'
      }
    });
    this.fitAddOn = new FitAddon();
    this.term.loadAddon(this.fitAddOn);
    this.term.open(this.terminalDiv.nativeElement);
    this.fitAddOn.fit();

    let { socket } = this.socketService;

    socket.on('connect', () => {
      this.term.write('\r\n*** Connected to backend ***\r\n');
    });
    this.term.onData((data) => {
      socket.emit('data', data);
    });

    // Backend -> Browser
    socket.on('data', (data: string) => {
      this.term.write(data);
    });
    socket.on('disconnect', () => {
      this.term.write('\r\n*** Disconnected from backend ***\r\n');
    });

    this.resizeObserver = new ResizeObserver(() => this._ngZone.run(() => {
      this._resize$.next();
    }));

    this.subscriptions = [
      this._resize$.pipe(debounceTime(200)).subscribe(() => this.fitAddOn.fit())
    ]

    this.resizeObserver.observe(this.terminalDiv.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.terminalDiv.nativeElement);
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
