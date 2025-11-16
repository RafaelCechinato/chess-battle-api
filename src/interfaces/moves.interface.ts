import { PieceType } from "../enums/pieces.type.enum";
import { Piece } from "./pieces.interface";
import { Position } from "./positions.interface";

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotion?: PieceType;
}