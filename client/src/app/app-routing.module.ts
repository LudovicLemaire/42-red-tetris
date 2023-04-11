import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { GamesComponent } from './games/games.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { GameComponent } from './game/game.component';
// import { EmptyComponent } from './empty/empty.component';

const routes: Routes = [
	{ path: 'first-component', component: FirstComponent },
	{ path: 'games', component: GamesComponent },
	{ path: 'game-component', component: GameComponent },
	{ path: 'game', component: GameRoomComponent },
	{ path: 'game/:roomId', component: GameRoomComponent },
	// { path: '**', component: EmptyComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}

// • http://<server_name_or_ip>:<port>/#<room>[<player_name>]
