import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareDialogComponent } from './nav/share-dialog/share-dialog.component';
import { SocketioService } from './socketio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { NavComponent } from './nav/nav.component';
import { MonacoEditorModule } from './vendor/ngx-monaco-editor-master/projects/editor/src/public-api';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AppComponent, NavComponent, ShareDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TextFieldModule,
    ClipboardModule,
    MonacoEditorModule.forRoot(),
    HttpClientModule
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent],
})
export class AppModule {}
