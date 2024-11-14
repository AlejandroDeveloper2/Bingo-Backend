"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class BingoBoard {
    constructor() {
        this.user = {
            name: "",
            email: "",
            password: "",
            sessionStatus: "offline",
        };
        this.balls = [];
        this.code = "";
        this.enableBingoBall = (gameMode, ballIndex, ballName) => {
            const diagonal = (0, _1.verifyDiagonalMode)(ballName, ballIndex);
            const vertical = (0, _1.verifyVerticalMode)(ballName);
            const horizontal = (0, _1.verifyHorizontalMode)(ballName, ballIndex);
            const corners = (0, _1.verifyCornersMode)(ballName, ballIndex);
            const isBingoBallEnabled = gameMode === "full"
                ? true
                : gameMode === "diagonal"
                    ? diagonal
                    : gameMode === "vertical"
                        ? vertical
                        : gameMode === "horizontal"
                            ? horizontal
                            : corners;
            return isBingoBallEnabled;
        };
    }
    getRangePerBallName(ballName) {
        const range = ballName === "B"
            ? { start: 1, end: 15 }
            : ballName === "I"
                ? { start: 16, end: 30 }
                : ballName === "N"
                    ? { start: 31, end: 45 }
                    : ballName === "G"
                        ? { start: 46, end: 60 }
                        : { start: 61, end: 75 };
        return range;
    }
    getBallNumbersRange({ start, end }) {
        const ballNumbers = [];
        for (let i = start; i <= end; i++) {
            ballNumbers.push(i);
        }
        return ballNumbers;
    }
    getRandomBallNumbers(elements, elementAmount) {
        const elementsCopy = [...elements];
        for (let i = elementsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elementsCopy[i], elementsCopy[j]] = [elementsCopy[j], elementsCopy[i]];
        }
        return elementsCopy.slice(0, elementAmount);
    }
    getRandomBoardModel() {
        const bingoBallNames = ["B", "I", "N", "G", "O"];
        let boardModel = {
            B: [],
            I: [],
            N: [],
            G: [],
            O: [],
        };
        for (let i = 0; i < bingoBallNames.length; i++) {
            const ballName = bingoBallNames[i];
            const range = this.getRangePerBallName(ballName);
            const ballsNumbersPerName = this.getBallNumbersRange(range);
            if (ballName === "N") {
                boardModel = Object.assign(Object.assign({}, boardModel), { [ballName]: this.getRandomBallNumbers(ballsNumbersPerName, 4) });
            }
            else {
                boardModel = Object.assign(Object.assign({}, boardModel), { [ballName]: this.getRandomBallNumbers(ballsNumbersPerName, 5) });
            }
        }
        return boardModel;
    }
    getBingoCardCode() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return `Carton-${code}`;
    }
    setUser(user) {
        this.user = user;
    }
    generateBingoCard(gameMode) {
        const boardModel = this.getRandomBoardModel();
        let balls = [];
        for (const key in boardModel) {
            if (Object.prototype.hasOwnProperty.call(boardModel, key)) {
                const parsedKey = key;
                const elements = boardModel[parsedKey];
                elements.forEach((element, i) => {
                    balls.push({
                        name: parsedKey,
                        number: element,
                        selected: false,
                        enabled: this.enableBingoBall(gameMode, i, parsedKey),
                    });
                });
            }
        }
        this.balls = balls;
        this.code = this.getBingoCardCode();
        return {
            balls: this.balls,
            user: this.user,
            code: this.code,
        };
    }
}
exports.default = BingoBoard;
