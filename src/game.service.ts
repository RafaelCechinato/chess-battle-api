import { TraditionalChessEngine } from "./engine/traditional.engine.class";
import { GameVariant } from "./enums/type.games.enum";
import { GameState } from "./interfaces/game.state.interface";
import { Position } from "./interfaces/positions.interface";
import { createGame, getGame, updateGame, deleteGame, listGames } from "./repositories/games.repository";

export class GameService {

  async createGame(variant: GameVariant = GameVariant.TRADITIONAL): Promise<{ gameId: string; state: GameState }> {
    const engine = new TraditionalChessEngine();

    const state = engine.getGameState();
    const gameId = await createGame(variant, state);

    return { gameId, state };
  }

  async getGame(gameId: string): Promise<GameState | null> {
    return await getGame(gameId);
  }

  async makeMove(gameId: string, from: Position, to: Position): Promise<GameState> {
    const state = await getGame(gameId);
    
    if (!state) {
      throw new Error('Game not found');
    }

    const engine = new TraditionalChessEngine(state);

    const success = engine.makeMove(from, to);
    
    if (!success) {
      throw new Error('Invalid move');
    }

    const newState = engine.getGameState();
    await updateGame(gameId, newState);

    return newState;
  }

  async getPossibleMoves(gameId: string, position: Position): Promise<Position[]> {
    const state = await getGame(gameId);
    
    if (!state) {
      throw new Error('Game not found');
    }

    const engine = new TraditionalChessEngine(state);

    return engine.getPossibleMoves(position);
  }

  async deleteGame(gameId: string): Promise<boolean> {
    return await deleteGame(gameId);
  }

  async listGames(limit?: number, offset?: number): Promise<any[]> {
    return await listGames(limit, offset);
  }
}