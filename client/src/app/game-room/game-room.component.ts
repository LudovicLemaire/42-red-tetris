import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlayerService } from '../player-service/player.service';
import { SocketIoService } from '../socketio-service/socket-io.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})

export class GameRoomComponent implements OnInit {
  private getMembersSub$!: Subscription;
  isAdmin!: boolean;
  private isAdminSub$!: Subscription;
  private kicked$!: Subscription;
  members: {id: string, name: string, isAdmin: boolean}[] = [];

  constructor(private route: ActivatedRoute, private socketIoService: SocketIoService, private playerService: PlayerService, private router: Router) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      let roomId: string = "";
      let userName: string = "";
      if (fragment) {
        let reg = fragment.match(/(?<=\[\s*).*?(?=\s*\])/gs)
        if (reg) userName = reg[0];
        roomId = fragment.split('[')[0];
        if (userName !== '')
          this.socketIoService.editName(userName);
        if (roomId !== '')
          this.socketIoService.joinRoom(roomId);
      }
    });

    this.route.paramMap.subscribe(params => {
      let roomId: string = params.get('roomId') ?? '';
      if (roomId !== '') {
        this.socketIoService.joinRoom(roomId);
      }
    });

    this.getMembersSub$ = this.socketIoService.getRoomMembers().subscribe((members:{id: string, name: string, isAdmin: boolean}[]) => {
      this.members = members;
    });

    this.kicked$ = this.socketIoService.kicked().subscribe((kicked: boolean) => {
      if (kicked === true)
        this.router.navigate(['/games-component']);
    });

    this.isAdminSub$ = this.playerService.getIsAdmin().subscribe((v: boolean) => {
      this.isAdmin = v;
    });
  }

  ngOnDestroy() {
    this.socketIoService.unsubSocket('get_room_members');
    this.getMembersSub$.unsubscribe();
    this.kicked$.unsubscribe();
    this.isAdminSub$.unsubscribe();
  }

  setRoom(room: string) {
    this.playerService.setRoom(room);
  }

  kickFromRoom(id: string) {
    this.socketIoService.kickFromRoom(id);
  }

  setAdmin(id: string) {
    this.socketIoService.setAdmin(id);
  }

  startGame() {
    this.socketIoService.setGameAvailability(true);
  }
}
