import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-player-sack',
	templateUrl: './player-sack.component.html',
	styleUrls: ['./player-sack.component.scss'],
})
export class PlayerSackComponent {
	@Input() sack!: number[];
	@Input() hasLost!: boolean;
	@Input() chaosPieceRemaining!: number;

	constructor() {}
}
