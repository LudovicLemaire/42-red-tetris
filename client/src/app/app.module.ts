import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirstComponent } from './first/first.component';
import { GamesComponent } from './games/games.component';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxContextModule } from 'ngx-context';
import { GameComponent } from './game/game.component';
import { TetrisboardComponent } from './game/tetrisboard/tetrisboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogRenameComponent } from './dialog-rename/dialog-rename.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { EmptyComponent } from './empty/empty.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { LottieModule } from 'ngx-lottie';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';

export function playerFactory() {
	return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@NgModule({
	declarations: [
		AppComponent,
		FirstComponent,
		GamesComponent,
		GameComponent,
		TetrisboardComponent,
		ChatboxComponent,
		DialogRenameComponent,
		GameRoomComponent,
		EmptyComponent,
		WaitingRoomComponent,
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
		MatCardModule,
		MatTabsModule,
		MatDialogModule,
		HotToastModule.forRoot(),
		MatChipsModule,
		MatMenuModule,
		LottieModule.forRoot({ player: playerFactory }),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
