import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketIoService } from '../socketio-service/socket-io.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
	animations: [
		trigger('moveButtonAnimation', [
			state('0', style({ marginLeft: '*' })),
			state('1', style({ marginLeft: 'calc(100% - 107px)' })),
			state('2', style({ marginLeft: 'calc(100% - 107px)',  marginTop: '100px'})),
			state('3', style({ marginTop: '100px' })),
			transition('* <=> *', animate(100))
		])
	],
})
export class GamesComponent implements OnInit {
	room = new UntypedFormControl('Room-5', [Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z].*-.*[0-9]')]);
	mouseOvered = 0;
	typeAnimation = 0;
  allGames: {[key: string]: number} = {};
  constructor(private socketIoService: SocketIoService, private router: Router) {}
  private getGamesSub$!: Subscription;

  ngOnInit(): void {
    this.getGamesSub$ = this.socketIoService.getGames().subscribe((games: {[key: string]: number}) => {
			this.allGames = games;
		})
    this.socketIoService.getGamesRequest();
  }

  ngOnDestroy() {
    this.socketIoService.unsubSocket('get_games');
    this.getGamesSub$.unsubscribe();
  }


	getErrorMessage() {
    if (this.room.hasError('required')) {
      return 'You must enter a value';
    }

		if (this.room.hasError('maxlength')) {
      return 'Too long';
    }

		if (this.room.hasError('pattern')) {
      return 'Wrong pattern [abc-5]';
    }

    return '';
  }

	moveButton() {
		if (this.getErrorMessage() !== '') {
			this.mouseOvered++
			if (this.mouseOvered%4 === 0) {
				this.typeAnimation = 4;
			} else if (this.mouseOvered%3 === 0) {
				this.typeAnimation = 3;
			} else if (this.mouseOvered%2 === 0) {
				this.typeAnimation = 2;
			} else {
				this.typeAnimation = 1;
			}
		}
	}



	joinRoom() {
		if (this.getErrorMessage() === '') {
      this.router.navigate(['/game/', this.room.value]);
		} else {
			console.log('not valid')
		}
  }
}
