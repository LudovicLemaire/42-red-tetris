import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';
import { HeroChildComponent } from './first/hero-child/hero-child.component';
import { HeroParentComponent } from './first/hero-parent/hero-parent.component';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThirdComponent } from './third/third.component';
import { ThirdSubComponent } from './third/third-sub/third-sub.component';
import { ThirdSubSubComponent } from './third/third-sub/third-sub-sub/third-sub-sub.component';
import { NgxContextModule } from 'ngx-context';

@NgModule({
  declarations: [
    AppComponent,
    FirstComponent,
    SecondComponent,
    HeroChildComponent,
    HeroParentComponent,
    ThirdComponent,
    ThirdSubComponent,
    ThirdSubSubComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgxContextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
