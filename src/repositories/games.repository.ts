import pool from '../database';
import { Color } from '../enums/teams.colors.enum';
import { GameVariant } from '../enums/type.games.enum';
import { GameState } from '../interfaces/game.state.interface';
import { QueryResult } from 'pg';

export async function createGame(variant: GameVariant, state: GameState): Promise<string> {
    try{
        const query = `
        INSERT INTO games (variant, current_turn, board_state, move_history, captured_pieces)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `;
        
        const values = [
        variant,
        state.currentTurn,
        JSON.stringify(state.board),
        JSON.stringify(state.moveHistory),
        JSON.stringify(state.capturedPieces)
        ];

        const result: QueryResult = await pool.query(query, values);
        return result.rows[0].id;
     } catch (error) {
        console.error("Erro ao criar jogo:", error);
        throw new Error('Não foi possível criar o jogo. tente mais tarde.');
    }
}

export async function getGame(gameId: string): Promise<GameState | null> {
    try{
        const query = 'SELECT * FROM games WHERE id = $1';
        const result: QueryResult = await pool.query(query, [gameId]);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            board: JSON.parse(row.board_state),
            currentTurn: row.current_turn,
            moveHistory: JSON.parse(row.move_history),
            variant: row.variant,
            isGameOver: row.is_game_over,
            winner: row.winner,
            capturedPieces: JSON.parse(row.captured_pieces)
        };
    }catch(error){
        console.error("Erro ao pegar jogo:", error);
        throw new Error('Não foi possível pegar o jogo. tente mais tarde.');
    }
}

export async function updateGame(gameId: string, state: GameState): Promise<void> {
    try{
        const query = `
        UPDATE games 
        SET current_turn = $1,
            board_state = $2,
            move_history = $3,
            captured_pieces = $4,
            is_game_over = $5,
            winner = $6,
            updated_at = NOW()
        WHERE id = $7
        `;

        const values = [
        state.currentTurn,
        JSON.stringify(state.board),
        JSON.stringify(state.moveHistory),
        JSON.stringify(state.capturedPieces),
        state.isGameOver,
        state.winner || null,
        gameId
        ];

        await pool.query(query, values);
    }catch(error){
        console.error("Erro ao atualizar jogo:", error);
        throw new Error('Não foi possível atualizar o jogo. tente mais tarde.');
    }
}

export async function deleteGame(gameId: string): Promise<boolean> {
    try{
        const query = 'DELETE FROM games WHERE id = $1 RETURNING id';
        const result: QueryResult = await pool.query(query, [gameId]);
        return result.rowCount !== null && result.rowCount > 0;
    }catch(error){
        console.error("Erro ao deletar jogo:", error);
        throw new Error('Não foi possível deletar o jogo. tente mais tarde.');
    }
  }

export async function listGames(limit: number = 50, offset: number = 0): Promise<any[]> {
    try{
        const query = `
        SELECT id, variant, current_turn, is_game_over, winner, created_at, updated_at
        FROM games
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `;
        
        const result: QueryResult = await pool.query(query, [limit, offset]);
        return result.rows;
    }catch(error){
        console.error("Erro ao listar jogo:", error);
        throw new Error('Não foi possível listar o jogo. tente mais tarde.');
    }
}

export async function addPlayerToGame(gameId: string, playerId: string, color: Color): Promise<void> {
    try{
        const query = `
        INSERT INTO game_players (game_id, player_id, color)
        VALUES ($1, $2, $3)
        `;
        
        await pool.query(query, [gameId, playerId, color]);
    }catch(error){
        console.error("Erro ao colocar jogador no jogo:", error);
        throw new Error('Não foi possível colocar jogador no jogo. tente mais tarde.');
    }
  }

export async function close(): Promise<void> {
    await pool.end();
}