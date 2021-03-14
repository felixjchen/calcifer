import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketioService } from './socketio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { NavComponent } from './nav/nav.component';
import { MonacoEditorModule } from './vendor/ngx-monaco-editor-master/projects/editor/src/public-api';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MonacoEditorModule.forRoot(),
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent],
})
export class AppModule {}
