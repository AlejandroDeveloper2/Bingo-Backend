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
const index_1 = require("@constants/index");
let intervalId = null;
class RandomBallLauncher {
    constructor(io) {
        this.gameBingoBalls = [...index_1.gameBingoBalls];
        this.remainingBalls = [...this.gameBingoBalls];
        this.timer = 5;
        this.isGameStarted = false;
        this.launchRandomBall = (gameId, token) => __awaiter(this, void 0, void 0, function* () {
            if (this.remainingBalls.length === 0) {
                this.io.emit("message", "¡El juego ha terminado!");
                this.stopBallLaunching();
                return;
            }
            const randomIndex = Math.floor(Math.random() * this.remainingBalls.length);
            const randomBall = this.remainingBalls[randomIndex];
            this.remainingBalls.splice(randomIndex, 1);
            this.io.emit("launched_ball", randomBall);
            /**Añadir balota lanzada al historial */
            const updatedHistory = yield this.saveBallToHistory(gameId, token, randomBall);
            this.io.emit("updated_history", Object.assign({}, updatedHistory));
            this.timer = 5; // Reiniciar el temporizador
        });
        this.io = io;
    }
    inicializeBalls() {
        this.remainingBalls = [...this.gameBingoBalls];
    }
    saveBallToHistory(gameId, token, ball) {
        return __awaiter(this, void 0, void 0, function* () {
            /**Añadir balota lanzada al historial */
            const res = yield fetch(`${process.env.BACKEND_URL}/api/bingo/ballHistory/${gameId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(ball),
            });
            if (!res.ok) {
                this.io.emit("message", "Error al guardar la balota en el historial");
            }
            const { data } = yield res.json();
            return data;
        });
    }
    // Función para iniciar el temporizador de balotas
    startTimer(gameId, token) {
        intervalId = setInterval(() => {
            if (this.timer === 0) {
                this.launchRandomBall(gameId, token);
            }
            else {
                this.timer--;
                this.io.emit("timer_update", this.timer); // Emitir el tiempo restante a los clientes
            }
        }, 1000);
    }
    stopBallLaunching() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            this.isGameStarted = false;
        }
    }
    startBallLaunching(gameId, token) {
        if (!this.isGameStarted) {
            this.inicializeBalls();
            this.isGameStarted = true;
            this.startTimer(gameId, token);
        }
    }
}
exports.default = RandomBallLauncher;
