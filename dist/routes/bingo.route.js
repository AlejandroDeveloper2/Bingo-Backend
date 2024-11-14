"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const index_1 = require("@controllers/index");
const userSession_middleware_1 = require("@middleware/userSession.middleware");
const router = (0, express_1.Router)();
exports.router = router;
const { postBingoGame, getBingoGames, getBingoGame, patchBingoGameStatus, addPlayerToBingoGame, deletePlayerFromBingo, createPlayerBingoCard, postBallToHistory, patchBingoBall, patchBingoWinner, cleanBingoGame, } = new index_1.BingoController();
router
    .post("/", userSession_middleware_1.checkJwt, postBingoGame)
    .get("/", userSession_middleware_1.checkJwt, getBingoGames)
    .get("/:gameId", userSession_middleware_1.checkJwt, getBingoGame)
    .patch("/status/:gameId", userSession_middleware_1.checkJwt, patchBingoGameStatus)
    .patch("/join/:gameId", userSession_middleware_1.checkJwt, addPlayerToBingoGame)
    .patch("/deletePlayer/:gameId/:playerId", userSession_middleware_1.checkJwt, deletePlayerFromBingo)
    .patch("/newCard/:gameId/:userId", userSession_middleware_1.checkJwt, createPlayerBingoCard)
    .patch("/ballHistory/:gameId", userSession_middleware_1.checkJwt, postBallToHistory)
    .patch("/selectBall/:gameId/:ballId", userSession_middleware_1.checkJwt, patchBingoBall)
    .patch("/winner/:gameId", userSession_middleware_1.checkJwt, patchBingoWinner)
    .get("/reset/:gameId", userSession_middleware_1.checkJwt, cleanBingoGame);
