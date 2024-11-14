"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("@services/.");
const index_1 = require("@utils/index");
const { createBingoGame, getAllBingoGames, getSingleBingoGame, updateBingoGameStatus, joinToBingoGame, removePlayerFromBingo, generatePlayerBingoCard, addBingoBallToHistory, selectBingoBall, setBingoWinner, resetBingoGame, } = new _1.BingoService();
class BingoController {
    constructor() {
        this.postBingoGame = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ body }, res) {
            try {
                const gameData = body;
                const bingoGame = yield createBingoGame(gameData);
                (0, index_1.handleHttpResponse)(res, {
                    data: bingoGame,
                    message: "¡Bingo creado con exito!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code } = e;
                const message = "¡Hubo un error al crear el bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.getBingoGames = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bingoGames = yield getAllBingoGames();
                (0, index_1.handleHttpResponse)(res, {
                    data: bingoGames,
                    message: "¡Sorteos de bingo obtenidos con exito!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code } = e;
                const message = "¡Hubo un error al listar los juegos de bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.getBingoGame = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params }, res) {
            try {
                const gameId = params.gameId;
                const bingoGame = yield getSingleBingoGame(gameId);
                (0, index_1.handleHttpResponse)(res, {
                    data: bingoGame,
                    message: "¡Sorteo de bingo obtenido con exito!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : "¡Hubo un error al listar los juegos de bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.patchBingoGameStatus = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params, body }, res) {
            try {
                const gameId = params.gameId;
                const gameStatus = body;
                const updatedGame = yield updateBingoGameStatus(gameId, gameStatus);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Estado del bingo actualizado con exito!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : "¡Hubo un error al actualizar el estado del bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.addPlayerToBingoGame = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params, body }, res) {
            try {
                const gameId = params.gameId;
                const player = body;
                const updatedGame = yield joinToBingoGame(gameId, player);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Te has unido a la partida de bingo!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : "¡Hubo un error al unirse a la partida de bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.deletePlayerFromBingo = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ body, params }, res) {
            try {
                const gameId = params.gameId;
                const playerId = params.playerId;
                const codeCard = body;
                const updatedGame = yield removePlayerFromBingo(gameId, playerId, codeCard);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Jugador eliminado de la partida de bingo!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : "¡Hubo un error al eliminar al jugador de la partida de bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.createPlayerBingoCard = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params, body }, res) {
            try {
                const gameId = params.gameId;
                const userId = params.userId;
                const gameMode = body;
                const updatedGame = yield generatePlayerBingoCard(gameId, userId, gameMode);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Cartón de bingo generado correctamente!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego o Id del usuario incorrecto!, por favor verifique."
                    : "¡Hubo un error al generar tu cartón de bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.postBallToHistory = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params, body }, res) {
            try {
                const gameId = params.gameId;
                const launchedBall = body;
                const updatedGame = yield addBingoBallToHistory(gameId, launchedBall);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Balota añadida al historial!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : "¡Hubo un error al guardar la balota en el historial!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.patchBingoBall = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params, body }, res) {
            try {
                const gameId = params.gameId;
                const ballId = params.ballId;
                const playerSelection = body;
                const updatedGame = yield selectBingoBall(gameId, ballId, playerSelection);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Balota correcta!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego, Id de la balota ó código del cartón incorrecto!, por favor verifique."
                    : errorType === "BAD_REQUEST"
                        ? "¡La balota que seleccionaste no ha salido aún!"
                        : errorType === "EMPTY"
                            ? "¡Aún no ha salido ninguna balota!"
                            : "¡Hubo un error al seleccionar la balota de bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.patchBingoWinner = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params, body }, res) {
            try {
                const gameId = params.gameId;
                const winnerData = body;
                const updatedGame = yield setBingoWinner(gameId, winnerData);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "Felicitaciones, ¡Has ganado la partida de Bingo!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : errorType === "BAD_REQUEST"
                        ? "¡Has sido descalificado!, Cantaste Bingo sin haber ganado."
                        : "¡Hubo un error al cantar Bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
        this.cleanBingoGame = (_a, res_1) => __awaiter(this, [_a, res_1], void 0, function* ({ params }, res) {
            try {
                const gameId = params.gameId;
                const updatedGame = yield resetBingoGame(gameId);
                (0, index_1.handleHttpResponse)(res, {
                    data: updatedGame,
                    message: "¡Juego reseteado con exito!",
                    code: 200,
                }, 200);
            }
            catch (e) {
                const { code, errorType } = e;
                const message = errorType === "NOT_FOUND"
                    ? "¡Id del juego incorrecto!, por favor verifique."
                    : "¡Hubo un error al resetear Bingo!";
                (0, index_1.handleHttpResponse)(res, {
                    data: null,
                    message,
                    code,
                }, code);
            }
        });
    }
}
exports.default = BingoController;
