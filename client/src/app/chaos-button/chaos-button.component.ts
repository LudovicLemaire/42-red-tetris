import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-chaos-button',
	templateUrl: './chaos-button.component.html',
	styleUrls: ['./chaos-button.component.scss'],
})
export class ChaosButtonComponent {
	@Input() chaosPieceAvailable!: number;
	constructor() {}
}
