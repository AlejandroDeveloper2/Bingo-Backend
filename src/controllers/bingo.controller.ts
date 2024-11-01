import { Request, Response } from "express";

import { Game } from "@interfaces/index";

import { BingoService } from "@services/.";
import { ErrorResponse, handleHttpResponse } from "@utils/index";

const {
  createBingoGame,
  getAllBingoGames,
  getSingleBingoGame,
  updateBingoGameStatus,
  joinToBingoGame,
  removePlayerFromBingo,
  generatePlayerBingoCard,
  getRandomBingoBall,
  selectBingoBall,
  setBingoWinner,
} = new BingoService();

class BingoController {
  constructor() {}

  public postBingoGame = async (
    { body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameData: Game = body;
      const bingoGame: Game = await createBingoGame(gameData);

      handleHttpResponse<Game>(
        res,
        {
          data: bingoGame,
          message: "¡Bingo creado con exito!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code } = e as ErrorResponse;
      const message: string = "¡Hubo un error al crear el bingo!";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };

  public getBingoGames = async (req: Request, res: Response): Promise<void> => {
    try {
      const bingoGames: Game[] = await getAllBingoGames();
      handleHttpResponse<Game[]>(
        res,
        {
          data: bingoGames,
          message: "¡Sorteos de bingo obtenidos con exito!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code } = e as ErrorResponse;
      const message: string = "¡Hubo un error al listar los juegos de bingo!";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };

  public getBingoGame = async (
    { params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const bingoGame: Game = await getSingleBingoGame(gameId);
      handleHttpResponse<Game>(
        res,
        {
          data: bingoGame,
          message: "¡Sorteo de bingo obtenido con exito!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : "¡Hubo un error al listar los juegos de bingo!";

      handleHttpResponse<null>(
        res,
        {
          data: null,
          message,
          code,
        },
        code
      );
    }
  };
  public patchBingoGameStatus = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {};
}

export default BingoController;
