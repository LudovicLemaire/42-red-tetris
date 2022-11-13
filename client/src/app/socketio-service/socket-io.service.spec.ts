import { TestBed } from '@angular/core/testing';
import { SocketIoService } from './socket-io.service';
import { Subscription } from 'rxjs';
import { Server } from 'mock-socket';

describe('SocketIoService', () => {
	let service: SocketIoService;
	let connectErrorSocketSub$!: Subscription;
	let test$!: Subscription;
	const mockServer = new Server('http://localhost:4200/');
	mockServer.on('connection', () => {
		console.log('PASSE 4200');
	});
	const mockServer2 = new Server('http://localhost:3030/');
	mockServer2.on('connection', () => {
		console.log('PASSE 3030');
	});

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
		mockServer.emit('self_get_room', 'Room-5');
	});
});

// // @ts-expect-error
