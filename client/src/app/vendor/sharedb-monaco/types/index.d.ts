// Type definitions for sharedb-monaco
// Project: https://github.com/codecollab-io/sharedb-monaco
// Definitions by: Carl Voller <https://github.com/Portatolova>
// TypeScript Version: 3.0

import { editor } from 'monaco-editor';
import * as sharedb from 'sharedb/lib/client';

export interface ShareDBMonacoOptions {
  id: string;
  namespace: string;
  wsurl: string;
}

export interface BindingsOptions {
  monaco: editor.ICodeEditor;
  path: string;
  doc: sharedb.Doc;
}
