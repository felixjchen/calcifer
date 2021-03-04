import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal/terminal.component';
import { FileSystemComponent } from './file-system/file-system.component';

@NgModule({
  declarations: [AppComponent, TerminalComponent, FileSystemComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
