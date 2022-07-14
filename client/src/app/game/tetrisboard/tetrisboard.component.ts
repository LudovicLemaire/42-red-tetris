import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tetrisboard',
  templateUrl: './tetrisboard.component.html',
  styleUrls: ['./tetrisboard.component.scss'],
})
export class TetrisboardComponent implements OnInit {
  @Input() playerGameboard!: number[][];

  constructor() {}

  ngOnInit(): void {}
}
