import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent  {
  playerGameboard: number[][];

  constructor() {
    this.playerGameboard = [];

    for (var i: number = 0; i < 20; i++) {
      this.playerGameboard[i] = [];
      for (var j: number = 0; j < 10; j++) {
        this.playerGameboard[i][j] = 0;
      }
    }

    this.playerGameboard[0][4] = 2;
    this.playerGameboard[1][3] = 2;
    this.playerGameboard[1][4] = 2;
    this.playerGameboard[1][5] = 2;

    this.playerGameboard[18 - 2][4] = 3;
    this.playerGameboard[19 - 2][3] = 3;
    this.playerGameboard[19 - 2][4] = 3;
    this.playerGameboard[19 - 2][5] = 3;

    this.playerGameboard[18][0] = 1;
    this.playerGameboard[18][1] = 1;
    this.playerGameboard[19][0] = 1;
    this.playerGameboard[19][1] = 1;

    this.playerGameboard[17][2] = 1;
    this.playerGameboard[18][2] = 1;
    this.playerGameboard[19][2] = 1;
    this.playerGameboard[18][3] = 1;

    this.playerGameboard[19][9] = 1;
    this.playerGameboard[19][8] = 1;
    this.playerGameboard[19][7] = 1;
    this.playerGameboard[19][6] = 1;

    this.playerGameboard[18][7] = 1;
    this.playerGameboard[18][8] = 1;
  }
}
