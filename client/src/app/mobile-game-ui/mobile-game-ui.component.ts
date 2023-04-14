import { Component, Input } from '@angular/core';
import { SocketIoService } from '../socketio-service/socket-io.service';

@Component({
	selector: 'app-mobile-game-ui',
	templateUrl: './mobile-game-ui.component.html',
	styleUrls: ['./mobile-game-ui.component.scss'],
})
export class MobileGameUIComponent {
	@Input() chaosPieceAvailable!: number;

	constructor(private socketIoService: SocketIoService) {}

	pushUI(direction: string) {
		if (
			direction === 'ArrowRight' ||
			direction === 'ArrowLeft' ||
			direction === 'ArrowDown' ||
			direction === 'ArrowUp' ||
			direction === ' ' ||
			direction === 'Chaos'
		) {
			if (direction === 'Chaos') {
				this.socketIoService.sendChaosPiece();
			} else {
				this.socketIoService.movePiece(direction);
			}
		}
	}
}
