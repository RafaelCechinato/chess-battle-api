import { ChessEngine } from "./chess.engine.class";
import { PieceType } from "../enums/pieces.type.enum";
import { Color } from "../enums/teams.colors.enum";
import { GameVariant } from "../enums/type.games.enum";
import { Piece } from "../interfaces/pieces.interface";
import { Position } from "../interfaces/positions.interface";
import { GameState } from "../interfaces/game.state.interface";

export class TraditionalChessEngine extends ChessEngine {
  
  constructor(state?: GameState | null) {
    super(state);
  }
  
  protected initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    board[0][0] = this.createPiece(PieceType.ROOK, Color.WHITE, 0, 0);
    board[0][1] = this.createPiece(PieceType.KNIGHT, Color.WHITE, 0, 1);
    board[0][2] = this.createPiece(PieceType.BISHOP, Color.WHITE, 0, 2);
    board[0][3] = this.createPiece(PieceType.QUEEN, Color.WHITE, 0, 3);
    board[0][4] = this.createPiece(PieceType.KING, Color.WHITE, 0, 4);
    board[0][5] = this.createPiece(PieceType.BISHOP, Color.WHITE, 0, 5);
    board[0][6] = this.createPiece(PieceType.KNIGHT, Color.WHITE, 0, 6);
    board[0][7] = this.createPiece(PieceType.ROOK, Color.WHITE, 0, 7);
    
    for (let col = 0; col < 8; col++) {
      board[1][col] = this.createPiece(PieceType.PAWN, Color.WHITE, 1, col);
    }
    
    board[7][0] = this.createPiece(PieceType.ROOK, Color.BLACK, 7, 0);
    board[7][1] = this.createPiece(PieceType.KNIGHT, Color.BLACK, 7, 1);
    board[7][2] = this.createPiece(PieceType.BISHOP, Color.BLACK, 7, 2);
    board[7][3] = this.createPiece(PieceType.QUEEN, Color.BLACK, 7, 3);
    board[7][4] = this.createPiece(PieceType.KING, Color.BLACK, 7, 4);
    board[7][5] = this.createPiece(PieceType.BISHOP, Color.BLACK, 7, 5);
    board[7][6] = this.createPiece(PieceType.KNIGHT, Color.BLACK, 7, 6);
    board[7][7] = this.createPiece(PieceType.ROOK, Color.BLACK, 7, 7);
    
    for (let col = 0; col < 8; col++) {
      board[6][col] = this.createPiece(PieceType.PAWN, Color.BLACK, 6, col);
    }
    
    return board;
  }

  isValidMove(from: Position, to: Position): boolean {
    if (!this.isPositionValid(from) || !this.isPositionValid(to)) {
      return false;
    }

    const piece = this.board[from.row][from.col];
    if (!piece) return false;

    const targetPiece = this.board[to.row][to.col];
    if (targetPiece && targetPiece.color === piece.color) {
      return false;
    }

    switch (piece.type) {
      case PieceType.PAWN:
        return this.isValidPawnMove(from, to, piece);
      case PieceType.KNIGHT:
        return this.isValidKnightMove(from, to);
      case PieceType.BISHOP:
        return this.isValidBishopMove(from, to);
      case PieceType.ROOK:
        return this.isValidRookMove(from, to);
      case PieceType.QUEEN:
        return this.isValidQueenMove(from, to);
      case PieceType.KING:
        return this.isValidKingMove(from, to);
      default:
        return false;
    }
  }

  private isValidPawnMove(from: Position, to: Position, piece: Piece): boolean {
    const direction = piece.color === Color.WHITE ? 1 : -1;
    const startRow = piece.color === Color.WHITE ? 1 : 6;
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    if (colDiff === 0) {
      if (rowDiff === direction && !this.board[to.row][to.col]) {
        return true;
      }
      if (from.row === startRow && rowDiff === 2 * direction && 
          !this.board[to.row][to.col] && !this.board[from.row + direction][from.col]) {
        return true;
      }
    }
    
    if (colDiff === 1 && rowDiff === direction && this.board[to.row][to.col]) {
      return true;
    }

    return false;
  }

  private isValidKnightMove(from: Position, to: Position): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  private isValidBishopMove(from: Position, to: Position): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    return rowDiff === colDiff && this.isPathClear(from, to);
  }

  private isValidRookMove(from: Position, to: Position): boolean {
    return (from.row === to.row || from.col === to.col) && this.isPathClear(from, to);
  }

  private isValidQueenMove(from: Position, to: Position): boolean {
    return this.isValidBishopMove(from, to) || this.isValidRookMove(from, to);
  }

  private isValidKingMove(from: Position, to: Position): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    return rowDiff <= 1 && colDiff <= 1;
  }

  getPossibleMoves(position: Position): Position[] {
    const moves: Position[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const to = { row, col };
        if (this.isValidMove(position, to)) {
          moves.push(to);
        }
      }
    }
    
    return moves;
  }

  protected getVariant(): GameVariant {
    return GameVariant.TRADITIONAL;
  }

  protected isGameOver(): boolean {
    return false;
  }

  protected getWinner(): Color | undefined {
    return undefined;
  }
}