import { Player } from './player';
import { GameMode } from './utils';

export class Game {
  public id: string;
  public members: Player[];
  public isAvailable: boolean;
  public gameMode: GameMode;
  public totalMemberAtStart: number;

  constructor (id: string) {
    this.id = id;
    this.isAvailable = true;
    this.members = [];
    this.gameMode = 'classic';
    this.totalMemberAtStart = 0;
  }
}
