import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public room$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isGameActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  public getIsGameActive() {
    return this.isGameActive$.asObservable();
  };
  public setIsGameActive(isActive: boolean) {
    this.isGameActive$.next(isActive);
  }
}
