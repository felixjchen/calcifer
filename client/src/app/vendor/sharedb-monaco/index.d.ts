/**
 * sharedb-monaco
 * ShareDB bindings for the Monaco Editor
 *
 * @name index.ts
 * @author Carl Ian Voller <carlvoller8@gmail.com>
 * @license MIT
 */
import WebSocket from 'reconnecting-websocket';
import EventEmitter from 'event-emitter-es6';
import * as sharedb from 'sharedb/lib/client';
import { editor } from 'monaco-editor';
import { ShareDBMonacoOptions } from './types';
import Bindings from './bindings';
declare interface ShareDBMonaco {
  on(event: 'ready', listener: () => void): this;
  on(event: 'close', listener: () => void): this;
}
declare class ShareDBMonaco extends EventEmitter {
  WS: WebSocket;
  doc: sharedb.Doc;
  private connection;
  bindings?: Bindings;
  /**
   * ShareDBMonaco
   * @param {ShareDBMonacoOptions} opts - Options object
   * @param {string} opts.id - ShareDB document ID
   * @param {string} opts.namespace - ShareDB document namespace
   * @param {string} opts.wsurl - URL for ShareDB Server API
   */
  constructor(opts: ShareDBMonacoOptions);
  add(monaco: editor.ICodeEditor, path: string, viewOnly?: boolean): void;
  close(): void;
}
export default ShareDBMonaco;
