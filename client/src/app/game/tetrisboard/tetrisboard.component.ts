import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
@Component({
	selector: 'app-tetrisboard',
	templateUrl: './tetrisboard.component.html',
	styleUrls: ['./tetrisboard.component.scss'],
})
export class TetrisboardComponent implements OnChanges, OnInit {
	@Input() playerGameboard!: number[][];
	@Input() anim!: boolean;
	@Input() lineBlocked!: number;
	public doAnim: boolean = true;
	constructor() {}

	ngOnInit(): void {
		if (!this.anim) {
			this.doAnim = false;
		}
	}

	/* istanbul ignore next */
	ngOnChanges(changes: SimpleChanges) {
		if (this.doAnim) {
			setTimeout(() => {
				this.doAnim = false;
			}, 3000);
		}
	}
}
