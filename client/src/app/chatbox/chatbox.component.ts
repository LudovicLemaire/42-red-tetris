import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogRenameComponent } from '../dialog-rename/dialog-rename.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { Subscription } from 'rxjs';
import { SocketIoService } from '../socketio-service/socket-io.service';
import { PlayerService } from '../player-service/player.service';
import { MediaMatcher } from '@angular/cdk/layout';

type Info = {
	user: string;
	name: string;
	type: string;
	message: string;
};

const CoolColors: string[] = [
	'#00c853',
	'#00e676',
	'#69f0ae',
	'#76ff03',
	'#eeff41',
	'#c6ff00',
	'#ffea00',
	'#ffff00',
	'#ffc400',
	'#ff8f00',
	'#ffa000',
	'#ff6d00',
	'#e65100',
	'#ffd180',
	'#ff3d00',
	'#ff9e80',
	'#a7ffeb',
	'#64ffda',
	'#1de9b6',
	'#00bfa5',
	'#00e5ff',
	'#00b8d4',
	'#0091ea',
	'#82b1ff',
	'#2962ff',
	'#304ffe',
	'#3d5afe',
	'#7c4dff',
	'#651fff',
	'#6200ea',
	'#aa00ff',
	'#d500f9',
	'#e040fb',
	'#ea80fc',
	'#c51162',
	'#f50057',
	'#ff4081',
	'#ff1744',
];

@Component({
	selector: 'app-chatbox',
	templateUrl: './chatbox.component.html',
	styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, OnDestroy {
	newMessage: string = '';
	infoListGlobal: Info[] = [];
	infoListRoom: Info[] = [];
	expanded: boolean = true;
	activeChatIndex: number = 0;
	private getNewInfoSub$!: Subscription;
	private getNewInfoRoomSub$!: Subscription;
	private selfJoinRoomSub$!: Subscription;
	isAdmin!: boolean;
	private isAdminSub$!: Subscription;
	room!: string;
	private room$!: Subscription;
	constructor(
		private socketIoService: SocketIoService,
		public dialog: MatDialog,
		private playerService: PlayerService,
		private media: MediaMatcher
	) {}

	ngOnInit(): void {
		this.getNewInfoSub$ = this.socketIoService
			.getNewInfo()
			.subscribe((userTypeMessage: [string, string, string, string]) => {
				let newMessage: Info = {
					user: userTypeMessage[0],
					name: userTypeMessage[1],
					type: userTypeMessage[2],
					message: userTypeMessage[3],
				};
				this.infoListGlobal.push(newMessage);
			});

		this.getNewInfoRoomSub$ = this.socketIoService
			.getNewInfoRoom()
			.subscribe((userTypeMessage: [string, string, string, string]) => {
				let newMessage: Info = {
					user: userTypeMessage[0],
					name: userTypeMessage[1],
					type: userTypeMessage[2],
					message: userTypeMessage[3],
				};
				this.infoListRoom.push(newMessage);
			});

		this.selfJoinRoomSub$ = this.socketIoService
			.selfGetRoom()
			.subscribe((room: string) => {
				this.infoListRoom = [];
				this.playerService.setRoom(room);
				this.playerService.setIsGameActive(false);
			});

		this.isAdminSub$ = this.playerService
			.getIsAdmin()
			.subscribe((v: boolean) => {
				this.isAdmin = v;
			});

		this.room$ = this.playerService.getRoom().subscribe((room: string) => {
			this.room = room;
		});

		/* istanbul ignore next */
		if (this.media.matchMedia('(max-width: 600px)').matches) {
			this.expanded = false;
		}
	}

	ngOnDestroy() {
		this.socketIoService.unsubSocket('info');
		if (this.getNewInfoSub$) this.getNewInfoSub$.unsubscribe();
		this.socketIoService.unsubSocket('info_room');
		if (this.getNewInfoRoomSub$) this.getNewInfoRoomSub$.unsubscribe();
		this.socketIoService.unsubSocket('self_get_room');
		if (this.selfJoinRoomSub$) this.selfJoinRoomSub$.unsubscribe();
		if (this.isAdminSub$) this.isAdminSub$.unsubscribe();
		if (this.room$) this.room$.unsubscribe();
	}

	/* istanbul ignore next */
	updateChatIndex($event: MatTabChangeEvent) {
		this.activeChatIndex = $event.index;
	}

	openDialog() {
		this.dialog.open(DialogRenameComponent);
	}

	leaveRooms() {
		this.socketIoService.leaveRooms();
	}

	sendMessage() {
		if (this.newMessage === '') return;
		if (this.activeChatIndex === 0)
			this.socketIoService.sendMessage(this.newMessage);
		else this.socketIoService.sendMessageRoom(this.newMessage);
		this.newMessage = '';
	}

	colorFromString(str: string) {
		let value: number = 0;
		for (var i = 0; i < str.length; i++) {
			value += str.charCodeAt(i);
		}
		return CoolColors[value % CoolColors.length];
	}

	changeExpanded() {
		this.expanded = !this.expanded;
	}
}
