import {
  BingoBall,
  BingoCard,
  Game,
  GameModeType,
  Player,
} from "@interfaces/index";

import { gameBingoBalls } from "@constants/index";

import { GameModel } from "@models/index";

import { ErrorResponse, handleError } from "@utils/index";

class GameService {
  private gameBingoBalls: BingoBall[] = [...gameBingoBalls];
  private remainingBalls = [...this.gameBingoBalls];

  constructor() {}

  public resetGameBingoBalls(): void {
    this.remainingBalls = [...this.gameBingoBalls];
  }

  private validateBingoBall = (bingoGame: Game, selectedBall: BingoBall) => {
    const isBallValid: boolean = bingoGame.launchedBallsHistory.some(
      (ball) =>
        ball.name === selectedBall.name && ball.number === selectedBall.number
    );

    if (!isBallValid) throw new ErrorResponse(400, "BAD_REQUEST");

    return isBallValid;
  };

  public getRandomBall = (): BingoBall | null => {
    if (this.remainingBalls.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.remainingBalls.length);
    const randomBall = this.remainingBalls[randomIndex];

    this.remainingBalls.splice(randomIndex, 1);

    return randomBall;
  };

  public verifyPlayerBingoBall = async (
    gameId: string,
    playerEmail: string,
    selectedBall: BingoBall
  ): Promise<Player> => {
    try {
      const bingoGame: Game | null = await GameModel.findOne({
        _id: gameId,
      });

      if (!bingoGame) throw new ErrorResponse(404, "NOT_FOUND");
      if (bingoGame.launchedBallsHistory.length === 0)
        throw new ErrorResponse(404, "EMPTY");

      const player: Player = bingoGame.players.filter(
        (player) => player.email === playerEmail
      )[0];

      if (!player) throw new ErrorResponse(404, "NOT_FOUND");

      this.validateBingoBall(bingoGame, selectedBall);
      return player;
    } catch (e: unknown) {
      return handleError(e);
    }
  };

  public verifyBingoWinner = (
    correctBallSelections: number,
    gameMode: GameModeType
  ): boolean => {
    const full: boolean = gameMode === "full" && correctBallSelections === 24;
    const diagonalOrCorners: boolean =
      gameMode === "diagonal" ||
      (gameMode === "corners" && correctBallSelections === 4);
    const verticalOrHorizontal: boolean =
      gameMode === "vertical" ||
      (gameMode === "horizontal" && correctBallSelections === 5);

    const isWinner: boolean = full || diagonalOrCorners || verticalOrHorizontal;
    return isWinner;
  };
}

export default GameService;
