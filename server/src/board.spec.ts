/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/restrict-template-expressions */
import { Board } from './board';

describe('socket part', () => {
  let board: Board;

  beforeEach((done) => {
    board = new Board();
    board.init(42, 'classic');
    done();
  });

  afterAll((done) => {
    done();
  });

  test('init', () => {
    expect(board.board[0][5]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);

    expect(board.board[18][5]).toBe(3);
    expect(board.board[19][3]).toBe(3);
    expect(board.board[19][4]).toBe(3);
    expect(board.board[19][5]).toBe(3);
  });

  test('droppiece new board', () => {
    board.dropPiece();
    expect(board.board[18][5]).toBe(1);
    expect(board.board[19][3]).toBe(1);
    expect(board.board[19][4]).toBe(1);
    expect(board.board[19][5]).toBe(1);
  });

  test('droppiece new board free', () => {
    board.init(42, 'free');
    board.dropPiece();
    expect(board.board[18][5]).toBe(1);
    expect(board.board[19][3]).toBe(1);
    expect(board.board[19][4]).toBe(1);
    expect(board.board[19][5]).toBe(1);
  });

  test('droppiece multiple piece board', () => {
    board.dropPiece();
    board.addPiece();
    board.dropPiece();

    expect(board.board[18][5]).toBe(1);
    expect(board.board[19][3]).toBe(1);
    expect(board.board[19][4]).toBe(1);
    expect(board.board[19][5]).toBe(1);

    expect(board.board[16][4]).toBe(1);
    expect(board.board[17][3]).toBe(1);
    expect(board.board[17][4]).toBe(1);
    expect(board.board[17][5]).toBe(1);
  });

  test('move piece right', () => {
    board.moveRightPiece();
    expect(board.board[0][5 + 1]).toBe(2);
    expect(board.board[1][3 + 1]).toBe(2);
    expect(board.board[1][4 + 1]).toBe(2);
    expect(board.board[1][5 + 1]).toBe(2);
  });

  test('move piece left', () => {
    board.moveLeftPiece();
    expect(board.board[0][5 - 1]).toBe(2);
    expect(board.board[1][3 - 1]).toBe(2);
    expect(board.board[1][4 - 1]).toBe(2);
    expect(board.board[1][5 - 1]).toBe(2);
  });

  test('cannot move piece right', () => {
    for (const line of board.board) {
      line[6] = 1;
    }
    board.moveRightPiece();
    expect(board.board[0][5]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);
  });

  test('cannot move piece left', () => {
    for (const line of board.board) {
      line[2] = 1;
    }
    board.moveLeftPiece();
    expect(board.board[0][5]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);
  });

  test('place ghost start', () => {
    board.placeGhost();
    expect(board.board[18][5]).toBe(3);
    expect(board.board[19][3]).toBe(3);
    expect(board.board[19][4]).toBe(3);
    expect(board.board[19][5]).toBe(3);
  });

  test('place ghost with previous piece', () => {
    board.dropPiece();
    board.addPiece();
    board.placeGhost();

    expect(board.board[18][5]).toBe(1);
    expect(board.board[19][3]).toBe(1);
    expect(board.board[19][4]).toBe(1);
    expect(board.board[19][5]).toBe(1);

    expect(board.board[16][4]).toBe(3);
    expect(board.board[17][3]).toBe(3);
    expect(board.board[17][4]).toBe(3);
    expect(board.board[17][5]).toBe(3);
  });

  test('fall free', () => {
    board.init(42, 'free');
    board.fall();
    expect(board.board[0 + 1][5]).toBe(2);
    expect(board.board[1 + 1][3]).toBe(2);
    expect(board.board[1 + 1][4]).toBe(2);
    expect(board.board[1 + 1][5]).toBe(2);
  });

  test('fall blocked', () => {
    for (let i = 0; i < board.board[2].length; i++) {
      board.board[2][i] = 1;
    }
    board.fall();

    expect(board.board[0][5]).toBe(1);
    expect(board.board[1][3]).toBe(1);
    expect(board.board[1][4]).toBe(1);
    expect(board.board[1][5]).toBe(1);
  });

  test('fall bottom', () => {
    for (let i = 0; i < board.board.length; i++) {
      board.fall();
    }

    expect(board.board[18][5]).toBe(1);
    expect(board.board[19][3]).toBe(1);
    expect(board.board[19][4]).toBe(1);
    expect(board.board[19][5]).toBe(1);
  });

  test('fail to place new piece', () => {
    resetBoard();
    for (let i = 0; i < board.board[1].length - 1; i++) {
      board.board[1][i] = 1;
    }
    board.addPiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][3]).toBe(1);
    expect(board.board[1][4]).toBe(1);
    expect(board.board[1][5]).toBe(1);
  });

  test('test chaos piece decrement', () => {
    board.chaosPieceRemaining = 2;
    board.addPiece();

    expect(board.chaosPieceRemaining).toBe(1);
  });

  test('test chaos piece placed', () => {
    board.chaosPieceRemaining = 1;
    board.addPiece();

    if (board.board[0][3] === 2) {
      expect(board.board[0][3]).toBe(2);
      expect(board.board[0][7]).toBe(2);
      expect(board.board[4][3]).toBe(2);
      expect(board.board[4][7]).toBe(2);
    } else if (board.board[0][4] === 2) {
      expect(board.board[0][4]).toBe(2);
      expect(board.board[0][5]).toBe(2);
      expect(board.board[1][3]).toBe(2);
      expect(board.board[1][6]).toBe(2);
    } else {
      expect(board.board[0][5]).toBe(2);
      expect(board.board[2][3]).toBe(2);
      expect(board.board[2][7]).toBe(2);
      expect(board.board[4][5]).toBe(2);
    }
    expect(board.chaosPieceRemaining).toBe(0);
  });

  test('test fail to place chaos piece', () => {
    resetBoard();
    for (let i = 0; i < board.board[0].length - 1; i++) {
      board.board[0][i] = 1;
    }

    board.chaosPieceRemaining = 1;
    board.addPiece();

    expect(board.board[0][5]).toBe(1);
  });

  test('reorderIfContainsCompleteLine', () => {
    resetBoard();

    for (let i = 0; i < board.board[0].length; i++) {
      board.board[7][i] = 1;
      board.board[8][i] = 1;
      board.board[9][i] = 1;
    }

    board.addPiece();
    board.dropPiece();

    expect(board.board[7][5]).toBe(0);
    expect(board.board[8][7]).toBe(0);
    expect(board.board[9][1]).toBe(0);

    expect(board.board[18][4]).toBe(1);
    expect(board.board[19][3]).toBe(1);
    expect(board.board[19][4]).toBe(1);
    expect(board.board[19][5]).toBe(1);
  });

  test('getChaosPieceAvailable', () => {
    board.init(42, 'pvp-chaos');
    board.score = 4242;
    expect(board.getChaosPieceAvailable()).toBe(8);
  });

  test('getChaosPieceAvailable multiple piece sent', () => {
    board.init(42, 'pvp-chaos');
    board.score = 4242;
    board.incrementChaosPieceSent();
    board.incrementChaosPieceSent();
    expect(board.getChaosPieceAvailable()).toBe(6);
  });

  test('getChaosPieceAvailable classic gamemode', () => {
    board.score = 4242;
    expect(board.getChaosPieceAvailable()).toBe(0);
  });

  test('getTopLeft on empty map', () => {
    resetBoard();

    const block = board.getTopLeft();
    expect(block.h).toBe(0);
    expect(block.w).toBe(0);
  });

  test('getTopLeft on start', () => {
    const block = board.getTopLeft();
    expect(block.h).toBe(0);
    expect(block.w).toBe(5);
  });

  test('getTopLeft after some movements', () => {
    board.fall();
    board.moveRightPiece();
    board.fall();

    const block = board.getTopLeft();
    expect(block.h).toBe(2);
    expect(block.w).toBe(6);
  });

  test('rotatePiece', () => {
    board.rotatePiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[2][4]).toBe(2);
    expect(board.board[2][5]).toBe(2);
  });

  test('rotatePiece fail block below', () => {
    for (let i = 0; i < board.board[0].length - 1; i++) {
      board.board[2][i] = 1;
    }

    board.rotatePiece();

    expect(board.board[0][5]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);
  });

  test('rotatePiece full', () => {
    board.rotatePiece();
    board.rotatePiece();
    board.rotatePiece();
    board.rotatePiece();
    board.rotatePiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[2][4]).toBe(2);
    expect(board.board[2][5]).toBe(2);
  });

  test('rotatePiece chaos piece', () => {
    resetBoard();
    board.chaosPieceRemaining = 1;
    board.addPiece();
    board.rotatePiece();

    expect(board.board[10][4]).toBe(0);
    expect(board.board[11][4]).toBe(0);
    expect(board.board[12][4]).toBe(0);
    expect(board.board[13][5]).toBe(0);
  });

  test('rotatePiece chaos piece full', () => {
    resetBoard();
    board.chaosPieceRemaining = 1;
    board.addPiece();
    board.rotatePiece();
    board.rotatePiece();
    board.rotatePiece();
    board.rotatePiece();
    board.rotatePiece();

    expect(board.board[10][4]).toBe(0);
    expect(board.board[11][4]).toBe(0);
    expect(board.board[12][4]).toBe(0);
    expect(board.board[13][5]).toBe(0);
  });

  test('rotatePiece fail map border', () => {
    for (let i = 0; i < 18; i++) {
      board.fall();
    }

    expect(board.board[18][5]).toBe(2);
    expect(board.board[19][3]).toBe(2);
    expect(board.board[19][4]).toBe(2);
    expect(board.board[19][5]).toBe(2);

    board.rotatePiece();

    expect(board.board[18][5]).toBe(2);
    expect(board.board[19][3]).toBe(2);
    expect(board.board[19][4]).toBe(2);
    expect(board.board[19][5]).toBe(2);
  });

  test('rotatePiece fail map border', () => {
    board.init(42, 'semi-chaos');
    for (let i = 0; i < 10; i++) {
      resetBoard();
      board.addPiece();
    }

    expect(board.board[0][3]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);
  });

  test('placeNewPiece fail first block', () => {
    resetBoard();
    board.board[0][4] = 1;
    board.addPiece();

    expect(board.board[0][4]).toBe(1);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);
  });

  test('placeNewPiece fail first block', () => {
    resetBoard();
    board.board[1][3] = 1;
    board.addPiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][3]).toBe(1);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(2);
  });

  test('placeNewPiece fail second block', () => {
    resetBoard();
    board.board[1][4] = 1;
    board.addPiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(1);
    expect(board.board[1][5]).toBe(2);
  });

  test('placeNewPiece fail third block', () => {
    resetBoard();
    board.board[1][5] = 1;
    board.addPiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(1);
  });

  test('placeNewPiece fail fourth block', () => {
    resetBoard();
    board.board[1][5] = 1;
    board.addPiece();

    expect(board.board[0][4]).toBe(2);
    expect(board.board[1][3]).toBe(2);
    expect(board.board[1][4]).toBe(2);
    expect(board.board[1][5]).toBe(1);
  });

  test('editSelfB invalid', () => {
    board.selfLB = 5;
    board.editSelfB(2);
    expect(board.selfLB).toBe(5);
  });

  test('editSelfB valid', () => {
    board.selfLB = 5;
    board.editSelfB(7);

    expect(board.selfLB).toBe(7);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function logBoard (): void {
    console.log('board', '\x1b[1m\x1b[36m', board.board, '\x1b[0m');
  }

  function resetBoard (): void {
    for (let i: number = 0; i < 20; i++) {
      board.board[i] = [];
      for (let j: number = 0; j < 10; j++) {
        board.board[i][j] = 0;
      }
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function log (title: string, variable: unknown): void {
  console.log(title, '\x1b[1m\x1b[36m', variable, '\x1b[0m');
}
