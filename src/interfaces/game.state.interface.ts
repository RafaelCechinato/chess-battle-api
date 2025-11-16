import { Color } from "../enums/teams.colors.enum";
import { GameVariant } from "../enums/type.games.enum";
import { Move } from "./moves.interface";
import { Piece } from "./pieces.interface";

export interface GameState {
  board: (Piece | null)[][];
  currentTurn: Color;
  moveHistory: Move[];
  variant: GameVariant;
  isGameOver: boolean;
  winner?: Color;
  capturedPieces: Piece[];
}