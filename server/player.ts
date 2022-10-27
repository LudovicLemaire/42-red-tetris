export class Player {
	public id: string
  public name: string;
	public room: string;
	public isAdmin: boolean;
 
  constructor(id: string, name: string) {
		this.id = id;
    this.name = name;
		this.room = '';
		this.isAdmin = false;
  }

	getAdminName(): string {
		if (this.isAdmin) {
			return '🚀 ' + this.name;
		} else {
			return this.name;
		}
	}
}
 
