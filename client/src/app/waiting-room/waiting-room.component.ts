import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../player-service/player.service';
import { SocketIoService } from '../socketio-service/socket-io.service';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
type GameMode =
	| 'classic'
	| 'battle'
	| 'blind'
	| 'free'
	| 'semi-chaos'
	| 'pvp-chaos';

@Component({
	selector: 'app-waiting-room',
	templateUrl: './waiting-room.component.html',
	styleUrls: ['./waiting-room.component.scss'],
	animations: [
		trigger('fadeAllAnimation', [
			state('false', style({ opacity: '80%' })),
			state('true', style({ opacity: '0%' })),
			transition('* <=> *', animate(750)),
		]),
	],
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
	private getMembersSub$!: Subscription;
	isAdmin!: boolean;
	isMobile: boolean = false;
	private isAdminSub$!: Subscription;
	private kickedSub$!: Subscription;
	private getReadySub$!: Subscription;

	members: { id: string; name: string; isAdmin: boolean }[] = [];
	modes: GameMode[] = [
		'classic',
		'battle',
		'blind',
		'free',
		'semi-chaos',
		'pvp-chaos',
	];
	selectedMode: GameMode = this.modes[0];

	animationOpacity: string = 'false';

	constructor(
		private route: ActivatedRoute,
		private socketIoService: SocketIoService,
		private playerService: PlayerService,
		private router: Router,
		private media: MediaMatcher
	) {}

	/* istanbul ignore next */
	ngOnInit(): void {
		this.route.fragment.subscribe(fragment => {
			let roomId: string = '';
			let userName: string = '';
			if (fragment) {
				console.log(fragment);
				let reg = fragment.match(/(?<=\[\s*).*?(?=\s*\])/gs);
				if (reg) userName = reg[0];
				roomId = fragment.split('[')[0];
				if (userName !== '') this.socketIoService.editName(userName);
				if (roomId !== '') this.socketIoService.joinRoom(roomId);
			}
		});

		this.route.paramMap.subscribe(params => {
			let roomId: string = params.get('roomId') ?? '';
			if (roomId !== '') {
				this.socketIoService.joinRoom(roomId);
			}
		});

		this.getMembersSub$ = this.socketIoService
			.getRoomMembers()
			.subscribe(
				(members: { id: string; name: string; isAdmin: boolean }[]) => {
					this.members = members;
				}
			);

		this.kickedSub$ = this.socketIoService
			.kicked()
			.subscribe((kicked: boolean) => {
				if (kicked === true) this.router.navigate(['/games']);
			});

		this.isAdminSub$ = this.playerService
			.getIsAdmin()
			.subscribe((v: boolean) => {
				this.isAdmin = v;
			});

		this.getReadySub$ = this.socketIoService
			.getReady()
			.subscribe((v: boolean) => {
				if (v) this.prepareGame();
			});

		if (this.media.matchMedia('(max-width: 600px)').matches) {
			this.isMobile = true;
		}
	}

	ngOnDestroy() {
		this.socketIoService.unsubSocket('get_room_members');
		if (this.getMembersSub$) {
			this.getMembersSub$.unsubscribe();
		}
		if (this.kickedSub$) {
			this.kickedSub$.unsubscribe();
		}
		if (this.isAdminSub$) {
			this.isAdminSub$.unsubscribe();
		}
		this.socketIoService.unsubSocket('get_ready');
		if (this.getReadySub$) {
			this.getReadySub$.unsubscribe();
		}
	}

	/* istanbul ignore next */
	updateModeIndex($event: MatTabChangeEvent) {
		this.selectedMode = this.modes[$event.index];
	}

	setRoom(room: string) {
		this.playerService.setRoom(room);
	}

	kickFromRoom(id: string) {
		this.socketIoService.kickFromRoom(id);
	}

	setAdmin(id: string) {
		this.socketIoService.setAdmin(id);
	}

	startGame() {
		this.socketIoService.setGameAvailability(false);
		this.socketIoService.prepareGame(this.selectedMode);
	}

	prepareGame() {
		this.animationOpacity = 'true';
		/** setTimeout to delete in correction if needed **/
		setTimeout(() => {
			this.playerService.setIsGameActive(true);
		}, 420);
	}
}
