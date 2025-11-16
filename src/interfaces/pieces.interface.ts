import { PieceType } from "../enums/pieces.type.enum";
import { Color } from "../enums/teams.colors.enum";
import { Position } from "./positions.interface";

export interface Piece {
  type: PieceType;
  color: Color;
  position: Position;
  hasMoved?: boolean;
}