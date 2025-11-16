import { Request, Response } from 'express';
import { errorHandler } from '../handler/error.handler';
import { v4 as uuidv4 } from 'uuid';
import { createUser, updateUser, getUserByNameOrEmail, getUserByEmail } from '../repositories/users.repository';
import { TraditionalChessEngine } from '../engine/traditional.engine.class';
import { GameSession } from '../interfaces/game.session.interface';
import { GameService } from '../game.service';

export class GamesController {

  private gameService = new GameService();

  async createGame(req: Request, res: Response) {
    try {
       const { variant = 'traditional' } = req.body;
        const result = await this.gameService.createGame(variant);
        res.json(result);
    } catch (e) {
      return errorHandler(e, res, "Erro ao criar jogo: ");
    }
  }

  async getGameStatus(req: Request, res: Response) {
    try {
      const state = await this.gameService.getGame(req.params.gameId);
    
      if (!state) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      res.json(state);
    } catch (e) {
      return errorHandler(e, res, "Erro ao pegar status do jogo: ");
    }
  }

  async makeMove(req: Request, res: Response) {
    try {
       const { from, to } = req.body;
      
      if (!from || !to) {
        return res.status(400).json({ error: 'Invalid move format' });
      }
      
      const state = await this.gameService.makeMove(req.params.gameId, from, to);
      res.json(state);
    } catch (e) {
      return errorHandler(e, res, "Erro ao realizar movimento: ");
    }
  }

  async getPossibleMoves(req: Request, res: Response) {
    try {
        const position = {
        row: parseInt(req.params.row),
        col: parseInt(req.params.col)
      };
      
      const moves = await this.gameService.getPossibleMoves(req.params.gameId, position);
      res.json({ moves });
    } catch (e) {
      return errorHandler(e, res, "Erro ao pegar possiveis movimentos: ");
    }
  }

  async deleteGame(req: Request, res: Response) {
    try {
      const deleted = await this.gameService.deleteGame(req.params.gameId);
    
      if (!deleted) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      res.json({ message: 'Game deleted' });
    } catch (e) {
      return errorHandler(e, res, "Erro ao deletar: ");
    }
  }

}