import { TestBed } from '@angular/core/testing';
import { SocketIoService } from './socket-io.service';
import { Subscription } from 'rxjs';

describe('SocketIoService', () => {
	let service: SocketIoService;
	let connectErrorSocketSub$!: Subscription;
	let test$!: Subscription;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SocketIoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	// it('connectError', done => {
	// 	connectErrorSocketSub$ = service
	// 		.connectError()
	// 		.subscribe((err: unknown) => {
	// 			if (err !== undefined) {
	// 				expect(err).toBeTruthy();
	// 				done();
	// 			}
	// 		});
	// 	mockServer.emit('connect_error', 'err');
	// });

	it('selfGetRoom', done => {
		test$ = service.selfGetRoom().subscribe((value: unknown) => {
			console.log('1:', value);
			// if (value !== undefined) {
			// 	expect(value[0]).toEqual(1);
			// 	done();
			// }
		});
	});
});

// // @ts-expect-error
