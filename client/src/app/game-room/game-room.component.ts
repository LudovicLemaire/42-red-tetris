import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { PlayerService } from '../player-service/player.service';
import { SocketIoService } from '../socketio-service/socket-io.service';

@Component({
	selector: 'app-game-room',
	templateUrl: './game-room.component.html',
	styleUrls: ['./game-room.component.scss'],
})
export class GameRoomComponent implements OnInit, OnDestroy {
	private isGameActiveSub$!: Subscription;
	private gameEnded$!: Subscription;
	isGameActive: boolean | undefined = undefined;
	isComplete: boolean = false;
	isMobile: boolean = false;
	private animationItem: AnimationItem | undefined;

	lottieOptions: AnimationOptions = {
		path: '/assets/lottie/rocket3.json',
		loop: 0,
		autoplay: false,
	};

	constructor(
		private playerService: PlayerService,
		private socketIoService: SocketIoService,
		private ngZone: NgZone,
		private media: MediaMatcher
	) {}

	ngOnInit(): void {
		this.isGameActiveSub$ = this.playerService
			.getIsGameActive()
			.subscribe((isActive: boolean) => {
				if (this.isGameActive === undefined && isActive === true)
					this.isComplete = true;
				this.isGameActive = isActive;
				if (isActive) {
					this.playLottie();
				}
			});

		/* istanbul ignore next */
		this.gameEnded$ = this.socketIoService
			.gameEnded()
			.subscribe((v: boolean | undefined) => {
				if (v !== undefined) {
					setTimeout(() => {
						this.playerService.setIsGameActive(false);
						this.isComplete = false;
						if (this.animationItem) {
							this.animationItem.stop();
						}
						this.socketIoService.getRoomMembersRequest();
					}, 4000);
				}
			});

		/* istanbul ignore next */
		if (this.media.matchMedia('(max-width: 600px)').matches) {
			this.isMobile = true;
		}
	}

	ngOnDestroy() {
		if (this.isGameActiveSub$) this.isGameActiveSub$.unsubscribe();
		if (this.gameEnded$) this.gameEnded$.unsubscribe();
		this.socketIoService.unsubSocket('game_ended');
	}

	didComplete() {
		this.isComplete = true;
	}

	playLottie(): void {
		this.ngZone.runOutsideAngular(() => {
			if (this.animationItem) {
				this.animationItem.setSpeed(0.75);
				this.animationItem.play();
			}
		});
	}

	animationCreated(animationItem: AnimationItem): void {
		this.animationItem = animationItem;
	}
}
