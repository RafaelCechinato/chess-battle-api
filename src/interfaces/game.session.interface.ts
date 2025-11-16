import { ChessEngine } from "../engine/chess.engine.class";

export interface GameSession {
  id: string;
  engine: ChessEngine;
  createdAt: Date;
}