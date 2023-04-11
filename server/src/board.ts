import { GameMode } from './utils';

interface Block {
  h: number
  w: number
}

const IPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     ⬛⬛⬛⬛     ⬛🟦⬛⬛     ⬛⬛⬛⬛     ⬛🟦⬛⬛
   *     🟦🟦🟦🟦     ⬛🟦⬛⬛     🟦🟦🟦🟦     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛🟦⬛⬛     ⬛⬛⬛⬛     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛🟦⬛⬛     ⬛⬛⬛⬛     ⬛🟦⬛⬛
   */
  [{ h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }, { h: 1, w: 3 }],
  [{ h: 0, w: 1 }, { h: 1, w: 1 }, { h: 2, w: 1 }, { h: 3, w: 1 }],
  [{ h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }, { h: 1, w: 3 }],
  [{ h: 0, w: 1 }, { h: 1, w: 1 }, { h: 2, w: 1 }, { h: 3, w: 1 }]
];

const JPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     🟦⬛⬛⬛     ⬛🟦🟦⬛     ⬛⬛⬛⬛     ⬛🟦⬛⬛
   *     🟦🟦🟦⬛     ⬛🟦⬛⬛     🟦🟦🟦⬛     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛🟦⬛⬛     ⬛⬛🟦⬛     🟦🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   */
  [{ h: 0, w: 0 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }],
  [{ h: 0, w: 1 }, { h: 0, w: 2 }, { h: 1, w: 1 }, { h: 2, w: 1 }],
  [{ h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }, { h: 2, w: 2 }],
  [{ h: 0, w: 1 }, { h: 1, w: 1 }, { h: 2, w: 0 }, { h: 2, w: 1 }]
];

const LPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     ⬛⬛🟦⬛     ⬛🟦⬛⬛     ⬛⬛⬛⬛     🟦🟦⬛⬛
   *     🟦🟦🟦⬛     ⬛🟦⬛⬛     🟦🟦🟦⬛     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛🟦🟦⬛     🟦⬛⬛⬛     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   */
  [{ h: 0, w: 2 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }],
  [{ h: 0, w: 1 }, { h: 1, w: 1 }, { h: 2, w: 1 }, { h: 2, w: 2 }],
  [{ h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }, { h: 2, w: 0 }],
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 1 }, { h: 2, w: 1 }]
];

const OPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     🟦🟦⬛⬛     🟦🟦⬛⬛     🟦🟦⬛⬛     🟦🟦⬛⬛
   *     🟦🟦⬛⬛     🟦🟦⬛⬛     🟦🟦⬛⬛     🟦🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   */
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }],
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }],
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }],
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }]
];

const SPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     ⬛🟦🟦⬛     🟦⬛⬛⬛     ⬛🟦🟦⬛     🟦⬛⬛⬛
   *     🟦🟦⬛⬛     🟦🟦⬛⬛     🟦🟦⬛⬛     🟦🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛🟦⬛⬛     ⬛⬛⬛⬛     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   */
  [{ h: 0, w: 1 }, { h: 0, w: 2 }, { h: 1, w: 0 }, { h: 1, w: 1 }],
  [{ h: 0, w: 0 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 2, w: 1 }],
  [{ h: 0, w: 1 }, { h: 0, w: 2 }, { h: 1, w: 0 }, { h: 1, w: 1 }],
  [{ h: 0, w: 0 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 2, w: 1 }]
];

const ZPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     🟦🟦⬛⬛     ⬛🟦⬛⬛     🟦🟦⬛⬛     ⬛🟦⬛⬛
   *     ⬛🟦🟦⬛     🟦🟦⬛⬛     ⬛🟦🟦⬛     🟦🟦⬛⬛
   *     ⬛⬛⬛⬛     🟦⬛⬛⬛     ⬛⬛⬛⬛     🟦⬛⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   */
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 1 }, { h: 1, w: 2 }],
  [{ h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 2, w: 0 }],
  [{ h: 0, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 1 }, { h: 1, w: 2 }],
  [{ h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 2, w: 0 }]
];

const TPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     ⬛🟦⬛⬛     ⬛🟦⬛⬛     ⬛⬛⬛⬛     ⬛🟦⬛⬛
   *     🟦🟦🟦⬛     ⬛🟦🟦⬛     🟦🟦🟦⬛     🟦🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛🟦⬛⬛     ⬛🟦⬛⬛     ⬛🟦⬛⬛
   *     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛     ⬛⬛⬛⬛
   */
  [{ h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }],
  [{ h: 0, w: 1 }, { h: 1, w: 1 }, { h: 1, w: 2 }, { h: 2, w: 1 }],
  [{ h: 1, w: 0 }, { h: 1, w: 1 }, { h: 1, w: 2 }, { h: 2, w: 1 }],
  [{ h: 0, w: 1 }, { h: 1, w: 0 }, { h: 1, w: 1 }, { h: 2, w: 1 }]
];

const ChaosRoundPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     🟦⬛⬛⬛🟦     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛
   *     ⬛⬛⬛⬛⬛     ⬛🟦⬛🟦⬛     ⬛⬛⬛⬛⬛     ⬛🟦⬛🟦⬛
   *     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛
   *     ⬛⬛⬛⬛⬛     ⬛🟦⬛🟦⬛     ⬛⬛⬛⬛⬛     ⬛🟦⬛🟦⬛
   *     🟦⬛⬛⬛🟦     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛
   */
  [{ h: 0, w: 0 }, { h: 0, w: 4 }, { h: 4, w: 0 }, { h: 4, w: 4 }],
  [{ h: 1, w: 1 }, { h: 1, w: 3 }, { h: 3, w: 1 }, { h: 3, w: 3 }],
  [{ h: 2, w: 2 }, { h: 2, w: 2 }, { h: 2, w: 2 }, { h: 2, w: 2 }],
  [{ h: 1, w: 1 }, { h: 1, w: 3 }, { h: 3, w: 1 }, { h: 3, w: 3 }]
];

const ChaosCrossPiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛
   *     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛
   *     🟦⬛⬛⬛🟦     ⬛🟦⬛🟦⬛     🟦⬛⬛⬛🟦     ⬛🟦⬛🟦⬛
   *     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛
   *     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛
   */
  [{ h: 0, w: 2 }, { h: 2, w: 0 }, { h: 2, w: 4 }, { h: 4, w: 2 }],
  [{ h: 1, w: 2 }, { h: 2, w: 1 }, { h: 2, w: 3 }, { h: 3, w: 2 }],
  [{ h: 0, w: 2 }, { h: 2, w: 0 }, { h: 2, w: 4 }, { h: 4, w: 2 }],
  [{ h: 1, w: 2 }, { h: 2, w: 1 }, { h: 2, w: 3 }, { h: 3, w: 2 }]
];

const ChaosSemiCirclePiece: Array<[Block, Block, Block, Block]> = [
  /**
   *     ⬛🟦🟦⬛⬛     ⬛⬛🟦⬛⬛     ⬛⬛⬛⬛⬛     ⬛🟦⬛⬛⬛
   *     🟦⬛⬛🟦⬛     ⬛⬛⬛🟦⬛     ⬛⬛⬛⬛⬛     🟦⬛⬛⬛⬛
   *     ⬛⬛⬛⬛⬛     ⬛⬛⬛🟦⬛     🟦⬛⬛🟦⬛     🟦⬛⬛⬛⬛
   *     ⬛⬛⬛⬛⬛     ⬛⬛🟦⬛⬛     ⬛🟦🟦⬛⬛     ⬛🟦⬛⬛⬛
   *     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛     ⬛⬛⬛⬛⬛
   */
  [{ h: 0, w: 1 }, { h: 0, w: 2 }, { h: 1, w: 0 }, { h: 1, w: 3 }],
  [{ h: 0, w: 2 }, { h: 1, w: 3 }, { h: 2, w: 3 }, { h: 3, w: 2 }],
  [{ h: 2, w: 0 }, { h: 2, w: 3 }, { h: 3, w: 1 }, { h: 3, w: 2 }],
  [{ h: 0, w: 1 }, { h: 1, w: 0 }, { h: 2, w: 0 }, { h: 3, w: 1 }]
];
const PiecesBasic: Array<Array<[Block, Block, Block, Block]>> = [IPiece, JPiece, LPiece, OPiece, SPiece, ZPiece, TPiece];
const PiecesChaos: Array<Array<[Block, Block, Block, Block]>> = [ChaosRoundPiece, ChaosCrossPiece, ChaosSemiCirclePiece];

export class Board {
  public board: number[][]; // 0: empty, placed, current, ghost
  public hasLost: boolean;
  private seed: number;
  public currentPiece: number;
  public currentSack: number[];
  private currentRotation: number;
  public chaosPieceRemaining: number;
  public currentChaosPiece: Array<[Block, Block, Block, Block]>;
  public piecePlaced: boolean;
  public score: number;
  public mode: GameMode;
  private chaosPieceSent: number;
  public selfLB: number;
  public lineCompleted: number;

  constructor () {
    this.board = [];
    this.hasLost = false;
    this.seed = 0;
    this.currentSack = [...Array(PiecesBasic.length).keys()];
    this.currentPiece = this.currentSack.length;
    this.currentRotation = 0;
    this.chaosPieceRemaining = 0;
    this.score = 0;
    this.chaosPieceSent = 0;
    this.currentChaosPiece = [];
    this.piecePlaced = true;
    this.mode = 'classic';
    this.selfLB = 0;
    this.lineCompleted = 0;
  }

  init (seed: number, mode: GameMode): void {
    this.hasLost = false;
    this.seed = seed;
    this.mode = mode;
    for (let i: number = 0; i < 20; i++) {
      this.board[i] = [];
      for (let j: number = 0; j < 10; j++) {
        this.board[i][j] = 0;
      }
    }
    const sackPart1 = Board.shuffle([...Array(PiecesBasic.length).keys()], this.seed - 2);
    const sackPart2 = Board.shuffle([...Array(PiecesBasic.length).keys()], this.seed - 1);
    this.currentSack = [...sackPart1, ...sackPart2];
    this.currentPiece = this.currentSack.length;
    this.chaosPieceRemaining = 0;
    this.score = 0;
    this.chaosPieceSent = 0;
    this.currentChaosPiece = [];
    this.selfLB = 0;
    this.lineCompleted = 0;
    this.addPiece();
    this.placeGhost();
  }

  dropPiece (): void {
    let maxFall: number = 20;
    // get distance from piece to maximum drop
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 3) {
          this.board[h][w] = 0;
        }
        if (this.board[h][w] === 2) {
          let currMaxFall: number = 1;
          while (h + currMaxFall < this.board.length - ((this.mode === 'classic' || this.mode === 'battle') ? this.selfLB : 0)) {
            if (this.board[h + currMaxFall][w] === 1) {
              break;
            }
            currMaxFall++;
          }
          currMaxFall--;
          if (currMaxFall < maxFall) {
            maxFall = currMaxFall;
          }
        }
      }
    }
    // place piece
    for (let h = this.board.length - 1; h >= 0; h--) {
      for (let w = this.board[h].length - 1; w >= 0; w--) {
        if (this.board[h][w] === 2) {
          this.board[h][w] = 0;
          this.board[h + maxFall][w] = 1;
        }
      }
    }
  }

  moveRightPiece (): void {
    let canMove: boolean = true;
    // check if can move
    for (let h = this.board.length - 1; h >= 0; h--) {
      for (let w = this.board[h].length - 1; w >= 0; w--) {
        if (this.board[h][w] === 2) {
          if (w + 1 > this.board[h].length - 1 ||
            this.board[h][w + 1] === 1) {
            canMove = false;
          }
        }
      }
    }
    if (canMove) {
      // move piece
      for (let h = this.board.length - 1; h >= 0; h--) {
        for (let w = this.board[h].length - 1; w >= 0; w--) {
          if (this.board[h][w] === 2) {
            this.board[h][w] = 0;
            this.board[h][w + 1] = 2;
          }
        }
      }
    }
  }

  moveLeftPiece (): void {
    let canMove: boolean = true;
    // check if can move
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 2) {
          if (w - 1 < 0 ||
            this.board[h][w - 1] === 1) {
            canMove = false;
          }
        }
      }
    }
    if (canMove) {
      // move piece
      for (let h = 0; h < this.board.length; h++) {
        for (let w = 0; w < this.board[h].length; w++) {
          if (this.board[h][w] === 2) {
            this.board[h][w] = 0;
            this.board[h][w - 1] = 2;
          }
        }
      }
    }
  }

  placeGhost (): void {
    let maxFall: number = 20;
    // get distance from piece to ghost place
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 3) {
          // remove previous ghost
          this.board[h][w] = 0;
        }
        if (this.board[h][w] === 2) {
          let currMaxFall: number = 1;
          while (h + currMaxFall < this.board.length - ((this.mode === 'classic' || this.mode === 'battle') ? this.selfLB : 0)) {
            if (this.board[h + currMaxFall][w] === 1) {
              break;
            }
            currMaxFall++;
          }
          currMaxFall--;
          if (currMaxFall < maxFall) {
            maxFall = currMaxFall;
          }
        }
      }
    }
    // place ghost piece
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 2) {
          if (this.board[h + maxFall][w] === 0) {
            this.board[h + maxFall][w] = 3;
          }
        }
      }
    }
  }

  fall (): boolean {
    /** Check if can fall **/
    let error: boolean = false;
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 2) {
          if (h <= this.board.length - 2 - ((this.mode === 'classic' || this.mode === 'battle') ? this.selfLB : 0)) {
            if (this.board[h + 1][w] === 1) {
              error = true;
            }
          } else {
            error = true;
          }
        }
      }
    }
    if (error) {
      /** Place the piece **/
      for (let h = 0; h < this.board.length; h++) {
        for (let w = 0; w < this.board[h].length; w++) {
          if (this.board[h][w] === 2) {
            this.board[h][w] = 1;
          }
        }
      }
      return false;
    } else {
      /** fall the piece of 1 **/
      for (let h = this.board.length - 1; h >= 0; h--) {
        for (let w = this.board[h].length - 1; w >= 0; w--) {
          if (this.board[h][w] === 2) {
            this.board[h][w] = 0;
            this.board[h + 1][w] = 2;
          }
        }
      }
      return true;
    }
  }

  addPiece (): boolean {
    this.piecePlaced = true;
    this.reorderIfContainsCompleteLine();
    this.currentRotation = 0;
    if (this.currentPiece >= PiecesBasic.length) {
      this.currentPiece = 0;
      const sackSecondPart = Board.shuffle(this.currentSack.slice(PiecesBasic.length), this.seed);
      this.currentSack = [...this.currentSack.slice(PiecesBasic.length), ...sackSecondPart];
      this.seed++;
      if (this.mode === 'semi-chaos') { this.chaosPieceRemaining++; }
    }
    if (this.chaosPieceRemaining > 0) {
      this.currentChaosPiece = PiecesChaos[Math.floor(Math.random() * PiecesChaos.length)];
      if (!this.placeNewPiece(this.currentChaosPiece[0])) {
        return false;
      }
      this.chaosPieceRemaining--;
    } else {
      this.currentChaosPiece = [];
      if (!this.placeNewPiece(PiecesBasic[this.currentSack[this.currentPiece]][0])) {
        return false;
      }
    }
    this.currentPiece++;
    return true;
  }

  getSpectra (): number[][] {
    const spectraBoard: number[][] = [];
    for (let i = 0; i < this.board.length; i++) {
      spectraBoard[i] = this.board[i].slice();
    }
    for (let h = 0; h < spectraBoard.length; h++) {
      for (let w = 0; w < spectraBoard[h].length; w++) {
        if (spectraBoard[h][w] === 2 || spectraBoard[h][w] === 3) { spectraBoard[h][w] = 0; }
      }
    }
    return spectraBoard;
  }

  placeNewPiece (p: [Block, Block, Block, Block]): boolean {
    const offsetH = 0;
    const offsetW = 3;
    // offset for I piece
    // if (p[3].w === 3 && p[3].h === 1) { offsetH = 1; }
    // check if can place piece
    if (this.board[0 + p[0].h - offsetH][offsetW + p[0].w] === 1 ||
      this.board[0 + p[1].h - offsetH][offsetW + p[1].w] === 1 ||
      this.board[0 + p[2].h - offsetH][offsetW + p[2].w] === 1 ||
      this.board[0 + p[3].h - offsetH][offsetW + p[3].w] === 1) {
      if (this.board[0 + p[0].h - offsetH][offsetW + p[0].w] !== 1) { this.board[0 + p[0].h - offsetH][offsetW + p[0].w] = 2; }
      if (this.board[0 + p[1].h - offsetH][offsetW + p[1].w] !== 1) { this.board[0 + p[1].h - offsetH][offsetW + p[1].w] = 2; }
      if (this.board[0 + p[2].h - offsetH][offsetW + p[2].w] !== 1) { this.board[0 + p[2].h - offsetH][offsetW + p[2].w] = 2; }
      if (this.board[0 + p[3].h - offsetH][offsetW + p[3].w] !== 1) { this.board[0 + p[3].h - offsetH][offsetW + p[3].w] = 2; }
      return false;
    }
    // remove old piece
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 2) { this.board[h][w] = 0; }
      }
    }
    // place new piece
    this.board[0 + p[0].h - offsetH][offsetW + p[0].w] = 2;
    this.board[0 + p[1].h - offsetH][offsetW + p[1].w] = 2;
    this.board[0 + p[2].h - offsetH][offsetW + p[2].w] = 2;
    this.board[0 + p[3].h - offsetH][offsetW + p[3].w] = 2;
    return true;
  }

  reorderIfContainsCompleteLine (): void {
    let lines = 0;
    for (let h = this.board.length - 1; h >= 0; h--) {
      let currLine = 0;
      for (let w = this.board[h].length - 1; w >= 0; w--) {
        if (this.board[h][w] === 1) { currLine++; }
      }
      if (currLine === this.board[h].length) {
        for (let hCopy = h - 1; hCopy >= 0; hCopy--) {
          this.board[hCopy + 1] = this.board[hCopy].slice(0);
        }
        h++;
        lines++;
      }
    }
    if (lines > 0) {
      this.score += (lines * 100 * 2) - 100;
      if (lines > 1) { this.lineCompleted += lines - 1; }
    }
  }

  rotatePiece (): void {
    if (this.currentRotation >= PiecesBasic[this.currentSack[this.currentPiece - 1]].length) {
      this.currentRotation = 0;
    }
    let currP: [Block, Block, Block, Block];
    let newP: [Block, Block, Block, Block] = PiecesBasic[this.currentSack[this.currentPiece - 1]][this.currentRotation + 1 >= PiecesBasic[this.currentSack[this.currentPiece - 1]].length ? 0 : this.currentRotation + 1];
    if (this.currentChaosPiece.length !== 0) {
      currP = this.currentChaosPiece[this.currentRotation];
      newP = this.currentChaosPiece[this.currentRotation + 1 >= this.currentChaosPiece.length ? 0 : this.currentRotation + 1];
    } else {
      currP = PiecesBasic[this.currentSack[this.currentPiece - 1]][this.currentRotation];
      newP = PiecesBasic[this.currentSack[this.currentPiece - 1]][this.currentRotation + 1 >= PiecesBasic[this.currentSack[this.currentPiece - 1]].length ? 0 : this.currentRotation + 1];
    }

    const offsetBoard: Block = this.getTopLeft();
    const offsetP: Block = currP[0];
    let canPlaceNewPiece: boolean = true;
    // check if can place the new piece
    for (const block of newP) {
      if (offsetBoard.h - offsetP.h + block.h < 0 || offsetBoard.h - offsetP.h + block.h >= this.board.length || offsetBoard.w - offsetP.w + block.w < 0 || offsetBoard.w - offsetP.w + block.w >= this.board[0].length) {
        canPlaceNewPiece = false;
      } else if (this.board[offsetBoard.h - offsetP.h + block.h][offsetBoard.w - offsetP.w + block.w] === 1) {
        canPlaceNewPiece = false;
      }
    }
    if (!canPlaceNewPiece) { return; }
    // remove the old piece
    for (const block of currP) {
      this.board[offsetBoard.h - offsetP.h + block.h][offsetBoard.w - offsetP.w + block.w] = 0;
    }
    // place the new rotated piece
    for (const block of newP) {
      this.board[offsetBoard.h - offsetP.h + block.h][offsetBoard.w - offsetP.w + block.w] = 2;
    }
    this.currentRotation++;
  }

  getTopLeft (): Block {
    for (let h = 0; h < this.board.length; h++) {
      for (let w = 0; w < this.board[h].length; w++) {
        if (this.board[h][w] === 2) { return { h, w }; }
      }
    }
    return { h: 0, w: 0 };
  }

  getChaosPieceAvailable (): number {
    if (this.mode === 'pvp-chaos') {
      return Math.floor(this.score / 500) - this.chaosPieceSent;
    }
    return 0;
  }

  incrementChaosPieceSent (): void {
    this.chaosPieceSent++;
  }

  // based on Fisher–Yates algorithm
  private static shuffle (pieces: number[], seed: number): number[] {
    let m = pieces.length;
    let t;
    let i;

    while (m > 0) {
      i = Math.floor(this.random(seed) * m--);

      t = pieces[m];
      pieces[m] = pieces[i];
      pieces[i] = t;
      ++seed;
    }

    return pieces;
  }

  private static random (seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
}
