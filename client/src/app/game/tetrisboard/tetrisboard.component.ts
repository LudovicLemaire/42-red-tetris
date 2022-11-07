import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-tetrisboard',
  templateUrl: './tetrisboard.component.html',
  styleUrls: ['./tetrisboard.component.scss'],

})
export class TetrisboardComponent  {
  @Input() playerGameboard!: number[][];

  constructor() {}
}
