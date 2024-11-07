import { Request, Response } from "express";

import {
  BingoBall,
  Game,
  Player,
  PlayerSelection,
  Winner,
} from "@interfaces/index";

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
  addBingoBallToHistory,
  selectBingoBall,
  setBingoWinner,
  resetBingoGame,
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
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const gameStatus: Pick<Game, "gameStatus"> = body;

      const updatedGame = await updateBingoGameStatus(gameId, gameStatus);

      handleHttpResponse<Pick<Game, "gameStatus">>(
        res,
        {
          data: updatedGame,
          message: "¡Estado del bingo actualizado con exito!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : "¡Hubo un error al actualizar el estado del bingo!";

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

  public addPlayerToBingoGame = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const player: Player = body;
      const updatedGame: Pick<Game, "players"> = await joinToBingoGame(
        gameId,
        player
      );

      handleHttpResponse<Pick<Game, "players">>(
        res,
        {
          data: updatedGame,
          message: "¡Te has unido a la partida de bingo!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : "¡Hubo un error al unirse a la partida de bingo!";

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

  public deletePlayerFromBingo = async (
    { body, params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const playerId: string = params.playerId;
      const codeCard: { code: string } = body;

      const updatedGame: Pick<Game, "players"> = await removePlayerFromBingo(
        gameId,
        playerId,
        codeCard
      );

      handleHttpResponse<Pick<Game, "players">>(
        res,
        {
          data: updatedGame,
          message: "¡Jugador eliminado de la partida de bingo!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : "¡Hubo un error al eliminar al jugador de la partida de bingo!";

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

  public createPlayerBingoCard = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const userId: string = params.userId;
      const gameMode: Pick<Game, "gameMode"> = body;

      const updatedGame: Pick<Game, "bingoCards"> =
        await generatePlayerBingoCard(gameId, userId, gameMode);

      handleHttpResponse<Pick<Game, "bingoCards">>(
        res,
        {
          data: updatedGame,
          message: "¡Cartón de bingo generado correctamente!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego o Id del usuario incorrecto!, por favor verifique."
          : "¡Hubo un error al generar tu cartón de bingo!";

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

  public postBallToHistory = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const launchedBall: BingoBall = body;

      const updatedGame: Pick<Game, "launchedBallsHistory"> =
        await addBingoBallToHistory(gameId, launchedBall);

      handleHttpResponse<Pick<Game, "launchedBallsHistory">>(
        res,
        {
          data: updatedGame,
          message: "¡Balota añadida al historial!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : "¡Hubo un error al guardar la balota en el historial!";

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

  public patchBingoBall = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const ballId: string = params.ballId;
      const playerSelection: PlayerSelection = body;

      const updatedGame: Pick<Game, "bingoCards" | "players"> =
        await selectBingoBall(gameId, ballId, playerSelection);

      handleHttpResponse<Pick<Game, "bingoCards" | "players">>(
        res,
        {
          data: updatedGame,
          message: "¡Balota correcta!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego, Id de la balota ó código del cartón incorrecto!, por favor verifique."
          : errorType === "BAD_REQUEST"
          ? "¡La balota que seleccionaste no ha salido aún!"
          : errorType === "EMPTY"
          ? "¡Aún no ha salido ninguna balota!"
          : "¡Hubo un error al seleccionar la balota de bingo!";

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
  public patchBingoWinner = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;
      const winnerData: Winner = body;
      const updatedGame: Pick<Game, "winner"> = await setBingoWinner(
        gameId,
        winnerData
      );

      handleHttpResponse<Pick<Game, "winner">>(
        res,
        {
          data: updatedGame,
          message: "Felicitaciones, ¡Has ganado la partida de Bingo!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : errorType === "BAD_REQUEST"
          ? "¡Has sido descalificado!, Cantaste Bingo sin haber ganado."
          : "¡Hubo un error al cantar Bingo!";

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

  public cleanBingoGame = async (
    { params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const gameId: string = params.gameId;

      const updatedGame: Game = await resetBingoGame(gameId);

      handleHttpResponse<Game>(
        res,
        {
          data: updatedGame,
          message: "¡Juego reseteado con exito!",
          code: 200,
        },
        200
      );
    } catch (e: unknown) {
      const { code, errorType } = e as ErrorResponse;
      const message: string =
        errorType === "NOT_FOUND"
          ? "¡Id del juego incorrecto!, por favor verifique."
          : "¡Hubo un error al resetear Bingo!";

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
}

export default BingoController;
