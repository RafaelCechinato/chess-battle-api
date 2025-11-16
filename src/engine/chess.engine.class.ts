import { PieceType } from "../enums/pieces.type.enum";
import { Color } from "../enums/teams.colors.enum";
import { GameVariant } from "../enums/type.games.enum";
import { GameState } from "../interfaces/game.state.interface";
import { Move } from "../interfaces/moves.interface";
import { Piece } from "../interfaces/pieces.interface";
import { Position } from "../interfaces/positions.interface";

export abstract class ChessEngine {
  protected board: (Piece | null)[][];
  protected currentTurn: Color;
  protected moveHistory: Move[];
  protected capturedPieces: Piece[];
  
  constructor(state?: GameState | null) {
    if (state) {
      this.board = state.board;
      this.currentTurn = state.currentTurn;
      this.moveHistory = state.moveHistory;
      this.capturedPieces = state.capturedPieces;
    } else {
      this.board = this.initializeBoard();
      this.currentTurn = Color.WHITE;
      this.moveHistory = [];
      this.capturedPieces = [];
    }
  }

  protected abstract initializeBoard(): (Piece | null)[][];
  
  abstract isValidMove(from: Position, to: Position): boolean;
  abstract getPossibleMoves(position: Position): Position[];
  
  protected createPiece(type: PieceType, color: Color, row: number, col: number): Piece {
    return { type, color, position: { row, col }, hasMoved: false };
  }

  getGameState(): GameState {
    return {
      board: this.board,
      currentTurn: this.currentTurn,
      moveHistory: this.moveHistory,
      variant: this.getVariant(),
      isGameOver: this.isGameOver(),
      winner: this.getWinner(),
      capturedPieces: this.capturedPieces
    };
  }

  protected abstract getVariant(): GameVariant;
  protected abstract isGameOver(): boolean;
  protected abstract getWinner(): Color | undefined;

  makeMove(from: Position, to: Position): boolean {
    if (!this.isValidMove(from, to)) {
      return false;
    }

    const piece = this.board[from.row][from.col];
    if (!piece || piece.color !== this.currentTurn) {
      return false;
    }

    const capturedPiece = this.board[to.row][to.col];
    
    // Realiza o movimento
    this.executeMove(from, to, piece, capturedPiece);
    
    // Troca o turno dos jogadores
    this.currentTurn = this.currentTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
    
    return true;
  }

  protected executeMove(from: Position, to: Position, piece: Piece, capturedPiece: Piece | null) {
    // Move a peça
    this.board[to.row][to.col] = piece;
    this.board[from.row][from.col] = null;
    piece.position = to;
    piece.hasMoved = true;

    if (capturedPiece) {
      this.capturedPieces.push(capturedPiece);
    }

    // Salva o movimento
    this.moveHistory.push({
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined
    });
  }

  protected isPositionValid(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }

  protected isPathClear(from: Position, to: Position): boolean {
    const rowDir = Math.sign(to.row - from.row);
    const colDir = Math.sign(to.col - from.col);
    
    let currentRow = from.row + rowDir;
    let currentCol = from.col + colDir;
    
    while (currentRow !== to.row || currentCol !== to.col) {
      if (this.board[currentRow][currentCol] !== null) {
        return false;
      }
      currentRow += rowDir;
      currentCol += colDir;
    }
    
    return true;
  }
}
