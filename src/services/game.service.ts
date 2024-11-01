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
  private gameBingoBalls: BingoBall[] = gameBingoBalls;
  constructor() {}

  private validateBingoBall = (bingoGame: Game, selectedBall: BingoBall) => {
    const isBallValid: boolean = bingoGame.randomBingoBalls.some(
      (ball) =>
        ball.name === selectedBall.name && ball.number === selectedBall.number
    );

    if (!isBallValid) throw new ErrorResponse(400, "BAD_REQUEST");

    return isBallValid;
  };

  public getRandomBall = (): BingoBall | undefined => {
    const gameBingoBallsCopy = [...this.gameBingoBalls];
    for (let i = gameBingoBallsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameBingoBallsCopy[i], gameBingoBallsCopy[j]] = [
        gameBingoBallsCopy[j],
        gameBingoBallsCopy[i],
      ];
    }

    const randomBall: BingoBall | undefined = gameBingoBallsCopy
      .slice(0, 1)
      .shift();

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
      if (bingoGame.randomBingoBalls.length === 0)
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
