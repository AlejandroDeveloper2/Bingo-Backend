import { Types } from "mongoose";

import {
  BingoCard,
  Game,
  Player,
  PlayerSelection,
  User,
  Winner,
} from "@interfaces/index";

import { GameModel, UserModel } from "@models/index";

import { BingoBoard, ErrorResponse, handleError } from "@utils/index";
import GameService from "./game.service";

class BingoService extends GameService {
  super() {}
  public createBingoGame = async (game: Game): Promise<Game> => {
    try {
      const newGame: Game = await GameModel.create(game);
      return newGame;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public getAllBingoGames = async (): Promise<Game[]> => {
    try {
      const games: Game[] = await GameModel.find({}).populate("winner");
      return games;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public getSingleBingoGame = async (gameId: string): Promise<Game> => {
    try {
      const game: Game | null = await GameModel.findOne({
        _id: gameId,
      }).populate("winner");
      if (!game) throw new ErrorResponse(404, "NOT_FOUND");
      return game;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public updateBingoGameStatus = async (
    gameId: string,
    { gameStatus }: Pick<Game, "gameStatus">
  ): Promise<Pick<Game, "gameStatus">> => {
    try {
      const updatedGameStatus: Pick<Game, "gameStatus"> | null =
        await GameModel.findOneAndUpdate(
          { _id: gameId },
          { gameStatus },
          { new: true }
        ).select("gameStatus");
      if (!updatedGameStatus) throw new ErrorResponse(404, "NOT_FOUND");
      return updatedGameStatus;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public joinToBingoGame = async (
    gameId: string,
    player: Player
  ): Promise<Pick<Game, "players">> => {
    try {
      const gamePlayers: Pick<Game, "players"> | null =
        await GameModel.findOneAndUpdate(
          { _id: gameId },
          { $push: { players: player } },
          { new: true }
        ).select("players");

      if (!gamePlayers) throw new ErrorResponse(404, "NOT_FOUND");
      return gamePlayers;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public removePlayerFromBingo = async (
    gameId: string,
    playerId: string
  ): Promise<Pick<Game, "players">> => {
    try {
      const gamePlayers: Pick<Game, "players"> | null =
        await GameModel.findOneAndUpdate(
          { _id: gameId },
          { $pull: { players: { _id: playerId } } },
          { new: true }
        ).select("players");

      if (!gamePlayers) throw new ErrorResponse(404, "NOT_FOUND");
      return gamePlayers;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public generatePlayerBingoCard = async (
    gameId: string,
    userId: string,
    { gameMode }: Pick<Game, "gameMode">
  ): Promise<Pick<Game, "bingoCards">> => {
    const bingoCard = new BingoBoard();
    try {
      const user: User | null = await UserModel.findOne({ _id: userId });
      if (!user) throw new ErrorResponse(404, "NOT_FOUND");
      bingoCard.setUser(user);
      const newBingoCard: BingoCard = bingoCard.generateBingoCard(gameMode);

      const bingoCards: Pick<Game, "bingoCards"> | null =
        await GameModel.findOneAndUpdate(
          { _id: gameId },
          { $push: { bingoCards: newBingoCard } },
          { new: true }
        ).select("bingoCards");
      if (!bingoCards) throw new ErrorResponse(404, "NOT_FOUND");
      return bingoCards;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public launchRandomBingoBall = async (
    gameId: string
  ): Promise<Pick<Game, "randomBingoBalls">> => {
    try {
      const randomBall = this.getRandomBall();
      if (!randomBall) throw new ErrorResponse(500, "SERVER_ERROR");

      const randomBingoBalls: Pick<Game, "randomBingoBalls"> | null =
        await GameModel.findOneAndUpdate(
          { _id: gameId },
          { $push: { randomBingoBalls: randomBall } },
          { new: true }
        ).select("randomBingoBalls");
      if (!randomBingoBalls) throw new ErrorResponse(404, "NOT_FOUND");
      return randomBingoBalls;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public selectBingoBall = async (
    gameId: string,
    ballId: string,
    { playerEmail, selectedBall, cardCode }: PlayerSelection
  ): Promise<Pick<Game, "bingoCards" | "players">> => {
    try {
      const player: Player = await this.verifyPlayerBingoBall(
        gameId,
        playerEmail,
        selectedBall
      );

      const updatedBingoCards: Pick<Game, "bingoCards" | "players"> | null =
        await GameModel.findOneAndUpdate(
          {
            _id: gameId,
            "bingoCards.code": cardCode,
            "bingoCards.balls._id": ballId,
            "players.email": playerEmail,
          },
          {
            $set: {
              "bingoCards.$[bingoCard].balls.$[ball].selected":
                selectedBall.selected,
              "bingoCards.$[bingoCard].balls.$[ball].enabled":
                selectedBall.enabled,
              "players.$[player].correctBallSelections":
                player.correctBallSelections + 1,
            },
          },
          {
            new: true,
            arrayFilters: [
              { "bingoCard.code": cardCode },
              { "ball._id": ballId },
              { "player.email": playerEmail },
            ],
          }
        ).select("bingoCards players");

      if (!updatedBingoCards) throw new ErrorResponse(404, "NOT_FOUND");
      return updatedBingoCards;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public setBingoWinner = async (
    gameId: string,
    { userId, correctBallSelections, gameMode }: Winner
  ): Promise<Pick<Game, "winner">> => {
    try {
      const isWinner: boolean = this.verifyBingoWinner(
        correctBallSelections,
        gameMode
      );

      if (!isWinner) throw new ErrorResponse(400, "BAD_REQUEST");

      const bingoWinner: Pick<Game, "winner"> | null =
        await GameModel.findOneAndUpdate(
          { _id: gameId },
          { winner: userId },
          { new: true }
        )
          .select("winner")
          .populate("winner");

      if (!bingoWinner) throw new ErrorResponse(404, "NOT_FOUND");

      return bingoWinner;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public resetBingoGame = async (gameId: string) => {
    try {
      const updatedGame: Game | null = await GameModel.findOneAndUpdate(
        { _id: gameId },
        {
          players: [],
          bingoCards: [],
          randomBingoBalls: [],
          gameMode: "full",
          gameStatus: "unstart",
          winner: null,
        },
        { new: true }
      );

      if (!updatedGame) throw new ErrorResponse(404, "NOT_FOUND");
      return updatedGame;
    } catch (e: unknown) {
      return handleError(e);
    }
  };
}

export default BingoService;
