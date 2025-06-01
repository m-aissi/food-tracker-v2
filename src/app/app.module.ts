import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent,
    FormsModule      
  ],
  providers: [],
  bootstrap: [AppComponent,HttpClientModule]
})
export class AppModule { } 