import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaygroundRoutingModule } from './playground-routing.module';
import { PlaygroundComponent } from './playground.component';
import { MenuComponent } from './menu/menu.component';
import { IdeComponent } from './ide/ide.component';
import { FileSystemExplorerComponent } from './ide/file-system-explorer/file-system-explorer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngularSplitModule } from '../vendor/angular-split/public_api';
import { EditorComponent } from './ide/editor/editor.component';
import { TerminalComponent } from './ide/terminal/terminal.component';
import { FileSearchComponent } from './ide/file-search/file-search.component';
import { SettingsComponent } from './ide/settings/settings.component';
import {CdkTreeModule} from '@angular/cdk/tree';
import { MonacoEditorModule } from '../vendor/ngx-monaco-editor-master/projects/editor/src/public-api';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  declarations: [
    PlaygroundComponent,
    TerminalComponent,
    MenuComponent,
    IdeComponent,
    FileSystemExplorerComponent,
    EditorComponent,
    FileSearchComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlaygroundRoutingModule,
    MatIconModule,
    MatButtonModule,
    AngularSplitModule,
    CdkTreeModule,
    MonacoEditorModule,
    ContextMenuModule.forRoot(),
  ],
})
export class PlaygroundModule {}
