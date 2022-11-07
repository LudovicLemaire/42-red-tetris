import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { PlayerService } from '../player-service/player.service';

@Component({
	selector: 'app-game-room',
	templateUrl: './game-room.component.html',
	styleUrls: ['./game-room.component.scss'],
})
export class GameRoomComponent implements OnInit, OnDestroy {
	private isGameActiveSub$!: Subscription;
	isGameActive: boolean = false;
	isComplete: boolean = false;
	private animationItem: AnimationItem | undefined;

	lottieOptions: AnimationOptions = {
		path: '/assets/lottie/rocket3.json',
		loop: 0,
		autoplay: false,
	};

	constructor(private playerService: PlayerService, private ngZone: NgZone) {}

	ngOnInit(): void {
		this.isGameActiveSub$ = this.playerService
			.getIsGameActive()
			.subscribe((isActive: boolean) => {
				this.isGameActive = isActive;
				if (isActive) {
					this.playLottie();
				}
			});
	}

	ngOnDestroy() {
		this.isGameActiveSub$.unsubscribe();
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
