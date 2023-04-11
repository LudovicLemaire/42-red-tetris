import { TestBed } from '@angular/core/testing';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
	let service: PlayerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlayerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('room get/set', done => {
		service.getRoom().subscribe((room: string) => {
			if (room !== '') {
				expect(room).toEqual('Room-5');
				done();
			}
		});
		service.setRoom('Room-5');
	});

	it('isAdmin get/set', done => {
		service.getIsAdmin().subscribe((v: boolean) => {
			if (v !== false) {
				expect(v).toBeTruthy();
				done();
			}
		});
		service.setIsAdmin(true);
	});

	it('isGameActive get/set', done => {
		service.getIsGameActive().subscribe((isActive: boolean) => {
			if (isActive !== false) {
				expect(isActive).toBeTruthy();
				done();
			}
		});
		service.setIsGameActive(true);
	});
});
