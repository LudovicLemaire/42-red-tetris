import { Player} from "./player";


export class Game {
  public id: string;
	public members: Player[];
	public isAvailable: boolean;
 
  constructor(id: string) {
    this.id = id;
		this.isAvailable = true;
		this.members = [];
  }
}
 
