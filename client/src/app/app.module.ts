import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirstComponent } from './first/first.component';
import { GamesComponent } from './games/games.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { GameComponent } from './game/game.component';
import { EmptyComponent } from './empty/empty.component';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { NgxContextModule } from 'ngx-context';
import { TetrisboardComponent } from './game/tetrisboard/tetrisboard.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DialogRenameComponent } from './dialog-rename/dialog-rename.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { LottieModule } from 'ngx-lottie';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { MobileGameUIComponent } from './mobile-game-ui/mobile-game-ui.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { PlayerSackComponent } from './player-sack/player-sack.component';
import { ChaosButtonComponent } from './chaos-button/chaos-button.component';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';

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
		MobileGameUIComponent,
		PlayerSackComponent,
		ChaosButtonComponent,
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
		MatGridListModule,
		MatPaginatorModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
