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
const index_1 = require("@models/index");
const index_2 = require("@utils/index");
class GameService {
    // private gameBingoBalls: BingoBall[] = [...gameBingoBalls];
    // private remainingBalls = [...this.gameBingoBalls];
    constructor() {
        // public resetGameBingoBalls(): void {
        //   this.remainingBalls = [...this.gameBingoBalls];
        // }
        this.validateBingoBall = (bingoGame, selectedBall) => {
            const isBallValid = bingoGame.launchedBallsHistory.some((ball) => ball.name === selectedBall.name && ball.number === selectedBall.number);
            if (!isBallValid)
                throw new index_2.ErrorResponse(400, "BAD_REQUEST");
            return isBallValid;
        };
        // public getRandomBall = (): BingoBall | null => {
        //   if (this.remainingBalls.length === 0) {
        //     return null;
        //   }
        //   const randomIndex = Math.floor(Math.random() * this.remainingBalls.length);
        //   const randomBall = this.remainingBalls[randomIndex];
        //   this.remainingBalls.splice(randomIndex, 1);
        //   return randomBall;
        // };
        this.verifyPlayerBingoBall = (gameId, playerEmail, selectedBall) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bingoGame = yield index_1.GameModel.findOne({
                    _id: gameId,
                });
                if (!bingoGame)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                if (bingoGame.launchedBallsHistory.length === 0)
                    throw new index_2.ErrorResponse(404, "EMPTY");
                const player = bingoGame.players.filter((player) => player.email === playerEmail)[0];
                if (!player)
                    throw new index_2.ErrorResponse(404, "NOT_FOUND");
                this.validateBingoBall(bingoGame, selectedBall);
                return player;
            }
            catch (e) {
                return (0, index_2.handleError)(e);
            }
        });
        this.verifyBingoWinner = (correctBallSelections, gameMode) => {
            const full = gameMode === "full" && correctBallSelections === 24;
            const diagonalOrCorners = gameMode === "diagonal" ||
                (gameMode === "corners" && correctBallSelections === 4);
            const verticalOrHorizontal = gameMode === "vertical" ||
                (gameMode === "horizontal" && correctBallSelections === 5);
            const isWinner = full || diagonalOrCorners || verticalOrHorizontal;
            return isWinner;
        };
    }
}
exports.default = GameService;
