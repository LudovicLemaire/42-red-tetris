import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SocketIoService } from '../socketio-service/socket-io.service';

@Component({
	selector: 'app-dialog-rename',
	templateUrl: './dialog-rename.component.html',
	styleUrls: ['./dialog-rename.component.scss'],
})
export class DialogRenameComponent {
	newName: string = '';

	constructor(
		private socketIoService: SocketIoService,
		private dialogRef: MatDialogRef<DialogRenameComponent>
	) {}

	editName() {
		if (this.newName !== '') {
			this.socketIoService.editName(this.newName);
			this.newName = '';
			this.dialogRef.close();
		}
	}
}
