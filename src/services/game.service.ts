import { BingoBall, Game, GameModeType } from "@interfaces/index";

import { gameBingoBalls } from "@constants/index";

import { GameModel } from "@models/index";

import { ErrorResponse, handleError } from "@utils/index";

class GameService {
  private gameBingoBalls: BingoBall[] = gameBingoBalls;
  constructor() {}
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
    cardCode: string,
    playerEmail: string,
    selectedBall: BingoBall
  ): Promise<Pick<Game, "randomBingoBalls" | "players">> => {
    try {
      const bingoGame: Pick<Game, "randomBingoBalls" | "players"> | null =
        await GameModel.findOne(
          {
            _id: gameId,
            "bingoCards.code": cardCode,
            "players.email": playerEmail,
          },
          {
            "bingoCards.$": 1,
            "players.$": 1,
          }
        ).select("randomBingoBalls players");

      if (!bingoGame) throw new ErrorResponse(404, "NOT_FOUND");
      if (bingoGame.randomBingoBalls.length === 0)
        throw new ErrorResponse(404, "EMPTY");

      const isBallValid: boolean = bingoGame.randomBingoBalls.some(
        (ball) =>
          ball.name === selectedBall.name && ball.number === selectedBall.number
      );

      if (!isBallValid) throw new ErrorResponse(400, "BAD_REQUEST");

      return bingoGame;
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
