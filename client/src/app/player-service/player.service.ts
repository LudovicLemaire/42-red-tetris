import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public room$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() { }

  public getIsAdmin() {
    return this.isAdmin$.asObservable();
  };
  public setIsAdmin(v: boolean) {
    this.isAdmin$.next(v);
  }

  public getRoom() {
    return this.room$.asObservable();
  };
  public setRoom(room: string) {
    this.room$.next(room);
  }
}
