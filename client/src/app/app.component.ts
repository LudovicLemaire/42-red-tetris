import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
	ChangeDetectorRef,
	Component,
	OnInit,
	OnDestroy,
	HostBinding,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SocketIoService } from './socketio-service/socket-io.service';
import { PlayerService } from './player-service/player.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
	title: string = 'red-tetris';
	mobileQuery: MediaQueryList;
	navList: { label: string; route: string; icon: string; disabled: boolean }[] =
		[
			{
				label: 'Home',
				route: '',
				icon: 'home',
				disabled: false,
			},
			{
				label: 'Games list',
				route: 'games',
				icon: 'settings',
				disabled: false,
			},
			// {
			// 	label: 'Game component',
			// 	route: 'game-component',
			// 	icon: 'videogame_asset',
			// 	disabled: false,
			// },
			{
				label: 'Game room',
				route: '',
				icon: 'videogame_asset',
				disabled: true,
			},
		];
	menu: boolean = false;

	toggleTheme = new UntypedFormControl(
		!(
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	);

	@HostBinding('class') className = '';

	private _mobileQueryListener: () => void;
	private toastSocketSub$!: Subscription;
	private isAdminSocketSub$!: Subscription;
	private resetSocketSub$!: Subscription;
	private connectErrorSocketSub$!: Subscription;
	private roomPlayerSub$!: Subscription;

	connectError: boolean = true;
	isAdmin!: boolean;
	room!: string;

	constructor(
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		public overlay: OverlayContainer,
		public socketIoService: SocketIoService,
		private toastService: HotToastService,
		private router: Router,
		private playerService: PlayerService
	) {
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		/* istanbul ignore next */
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		/* istanbul ignore next */
		this.mobileQuery.addEventListener('change', _ => {
			this._mobileQueryListener;
		});
		if (this.mobileQuery.matches) {
			this.menu = true;
		}
	}

	triggerMenu(): void {
		this.menu = !this.menu;
	}

	/* istanbul ignore next */
	ngOnInit(): void {
		const windowsLightModeActive = false;
		// window.matchMedia &&
		// window.matchMedia('(prefers-color-scheme: light)').matches;
		this.changeTheme(windowsLightModeActive);

		const mql = window.matchMedia('(prefers-color-scheme: light)');
		mql.addEventListener('change', e => {
			this.toggleTheme.setValue(e.matches);
		});

		this.toggleTheme.valueChanges.subscribe(lightMode => {
			this.changeTheme(lightMode);
		});

		this.toastSocketSub$ = this.socketIoService
			.toast()
			.subscribe((toast: [string, string]) => {
				if (toast[1] === 'That room name is already taken')
					this.router.navigate(['/games']);
				if (
					toast[0] === 'info' ||
					toast[0] === 'error' ||
					toast[0] === 'success' ||
					toast[0] === 'warning'
				)
					this.toastService[toast[0]](toast[1], {
						position: 'top-right',
						dismissible: true,
						theme: this.toggleTheme.value ? undefined : 'snackbar',
					});
				else if (toast[0] === 'show')
					this.toastService.show(toast[1], {
						position: 'top-right',
						dismissible: true,
						theme: this.toggleTheme.value ? undefined : 'snackbar',
						icon: '🚀',
					});
			});

		this.isAdminSocketSub$ = this.socketIoService
			.selfIsAdmin()
			.subscribe((isAdmin: boolean) => {
				this.playerService.setIsAdmin(isAdmin);
			});

		this.connectErrorSocketSub$ = this.socketIoService
			.connectError()
			.subscribe((err: unknown) => {
				if (err) this.connectError = true;
				if (err)
					this.toastService.error('ERROR - Disconnection (CODE 30000)', {
						position: 'top-right',
						dismissible: true,
						theme: this.toggleTheme.value ? undefined : 'snackbar',
					});
			});

		this.roomPlayerSub$ = this.playerService
			.getRoom()
			.subscribe((room: string) => {
				this.room = room;
				this.navList[this.navList.length - 1].disabled =
					room !== '' ? false : true;
				this.navList[this.navList.length - 1].route = 'game/' + room;
			});

		this.resetSocketSub$ = this.socketIoService.reset().subscribe(() => {
			if (this.connectError === false) return;
			this.connectError = false;
			if (this.room === '') {
			} else {
				this.toastService.warning('The station has been reset', {
					position: 'top-right',
					dismissible: true,
					theme: this.toggleTheme.value ? undefined : 'snackbar',
				});
				this.playerService.setIsAdmin(false);
				this.playerService.setRoom('');
				this.playerService.setIsGameActive(false);
				this.router.navigate(['/games']);
			}
		});
	}

	/* istanbul ignore next */
	ngOnDestroy(): void {
		this.mobileQuery.removeEventListener('change', _ => {
			this._mobileQueryListener;
		});
		this.socketIoService.unsubSocket('toast');
		if (this.toastSocketSub$) this.toastSocketSub$.unsubscribe();
		this.socketIoService.unsubSocket('self_is_admin');
		if (this.isAdminSocketSub$) this.isAdminSocketSub$.unsubscribe();
		this.socketIoService.unsubSocket('reset');
		if (this.resetSocketSub$) this.resetSocketSub$.unsubscribe();
		this.socketIoService.unsubSocket('connect_error');
		if (this.connectErrorSocketSub$) this.connectErrorSocketSub$.unsubscribe();
		if (this.roomPlayerSub$) this.roomPlayerSub$.unsubscribe();
	}

	changeTheme(lightMode: boolean): void {
		const lightModeClassName = 'light-theme';
		this.className = lightMode ? lightModeClassName : '';
		if (lightMode) {
			this.overlay.getContainerElement().classList.add(lightModeClassName);
		} else {
			this.overlay.getContainerElement().classList.remove(lightModeClassName);
		}
	}
}
