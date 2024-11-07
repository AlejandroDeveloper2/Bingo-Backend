import { Router } from "express";

import { BingoController } from "@controllers/index";
import { checkJwt } from "@middleware/userSession.middleware";

const router = Router();

const {
  postBingoGame,
  getBingoGames,
  getBingoGame,
  patchBingoGameStatus,
  addPlayerToBingoGame,
  deletePlayerFromBingo,
  createPlayerBingoCard,
  postBallToHistory,
  patchBingoBall,
  patchBingoWinner,
  cleanBingoGame,
} = new BingoController();

router
  .post("/", checkJwt, postBingoGame)
  .get("/", checkJwt, getBingoGames)
  .get("/:gameId", checkJwt, getBingoGame)
  .patch("/status/:gameId", checkJwt, patchBingoGameStatus)
  .patch("/join/:gameId", checkJwt, addPlayerToBingoGame)
  .patch("/deletePlayer/:gameId/:playerId", checkJwt, deletePlayerFromBingo)
  .patch("/newCard/:gameId/:userId", checkJwt, createPlayerBingoCard)
  .patch("/ballHistory/:gameId", checkJwt, postBallToHistory)
  .patch("/selectBall/:gameId/:ballId", checkJwt, patchBingoBall)
  .patch("/winner/:gameId", checkJwt, patchBingoWinner)
  .get("/reset/:gameId", checkJwt, cleanBingoGame);

export { router };
