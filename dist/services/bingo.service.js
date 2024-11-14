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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@models/index");
const index_2 = require("@utils/index");
const game_service_1 = __importDefault(require("./game.service"));
class BingoService extends game_service_1.default {
    constructor() {
        super(...arguments);
        this.createBingoGame = (game) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newGame = yield index_1.GameModel.create(game);
                return newGame;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.getAllBingoGames = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const games = yield index_1.GameModel.find({}).populate("winner");
                return games;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.getSingleBingoGame = (gameId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield index_1.GameModel.findOne({
                    _id: gameId,
                }).populate("winner");
                if (!game)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return game;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.updateBingoGameStatus = (gameId_1, _a) => __awaiter(this, [gameId_1, _a], void 0, function* (gameId, { gameStatus }) {
            try {
                const updatedGameStatus = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, { gameStatus }, { new: true }).select("gameStatus");
                if (!updatedGameStatus)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return updatedGameStatus;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.joinToBingoGame = (gameId, player) => __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield index_1.GameModel.findOne({
                    players: { $elemMatch: { email: player.email } },
                }).select("players");
                if (game)
                    return game;
                const gamePlayers = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, { $push: { players: player } }, { new: true }).select("players");
                if (!gamePlayers)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return gamePlayers;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.removePlayerFromBingo = (gameId_1, playerId_1, _a) => __awaiter(this, [gameId_1, playerId_1, _a], void 0, function* (gameId, playerId, { code }) {
            try {
                const gamePlayers = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, { $pull: { players: { _id: playerId }, bingoCards: { code } } }, { new: true }).select("players");
                if (!gamePlayers)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return gamePlayers;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.generatePlayerBingoCard = (gameId_1, userId_1, _a) => __awaiter(this, [gameId_1, userId_1, _a], void 0, function* (gameId, userId, { gameMode }) {
            const bingoCard = new index_2.BingoBoard();
            try {
                const user = yield index_1.UserModel.findOne({ _id: userId });
                if (!user)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                bingoCard.setUser(user);
                const newBingoCard = bingoCard.generateBingoCard(gameMode);
                const bingoCards = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, { $push: { bingoCards: newBingoCard } }, { new: true }).select("bingoCards");
                if (!bingoCards)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return bingoCards;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.addBingoBallToHistory = (gameId, launchedBall) => __awaiter(this, void 0, void 0, function* () {
            try {
                const randomBingoBalls = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, {
                    $push: { launchedBallsHistory: launchedBall },
                }, { new: true }).select("launchedBallsHistory");
                if (!randomBingoBalls)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return randomBingoBalls;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.selectBingoBall = (gameId_1, ballId_1, _a) => __awaiter(this, [gameId_1, ballId_1, _a], void 0, function* (gameId, ballId, { playerEmail, selectedBall, cardCode }) {
            try {
                const player = yield this.verifyPlayerBingoBall(gameId, playerEmail, selectedBall);
                const updatedBingoCards = yield index_1.GameModel.findOneAndUpdate({
                    _id: gameId,
                    "bingoCards.code": cardCode,
                    "bingoCards.balls._id": ballId,
                    "players.email": playerEmail,
                }, {
                    $set: {
                        "bingoCards.$[bingoCard].balls.$[ball].selected": selectedBall.selected,
                        "bingoCards.$[bingoCard].balls.$[ball].enabled": selectedBall.enabled,
                        "players.$[player].correctBallSelections": player.correctBallSelections + 1,
                    },
                }, {
                    new: true,
                    arrayFilters: [
                        { "bingoCard.code": cardCode },
                        { "ball._id": ballId },
                        { "player.email": playerEmail },
                    ],
                }).select("bingoCards players");
                if (!updatedBingoCards)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return updatedBingoCards;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.setBingoWinner = (gameId_1, _a) => __awaiter(this, [gameId_1, _a], void 0, function* (gameId, { userId, correctBallSelections, gameMode }) {
            try {
                const isWinner = this.verifyBingoWinner(correctBallSelections, gameMode);
                if (!isWinner)
                    throw new index_2.ErrorResponse(400, "BAD_REQUEST");
                const bingoWinner = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, { winner: userId }, { new: true })
                    .select("winner")
                    .populate("winner");
                if (!bingoWinner)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return bingoWinner;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.resetBingoGame = (gameId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedGame = yield index_1.GameModel.findOneAndUpdate({ _id: gameId }, {
                    players: [],
                    bingoCards: [],
                    launchedBallsHistory: [],
                    gameMode: "full",
                    gameStatus: "unstart",
                    winner: null,
                }, { new: true });
                if (!updatedGame)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                return updatedGame;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
    }
    super() { }
}
exports.default = BingoService;
