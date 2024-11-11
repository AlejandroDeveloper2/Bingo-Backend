import { Server } from "socket.io";

import { gameBingoBalls } from "@constants/index";
import { BingoBall, Game, ServerResponse } from "@interfaces/index";

let intervalId: NodeJS.Timeout | null = null;

export default class RandomBallLauncher {
  private gameBingoBalls: BingoBall[] = [...gameBingoBalls];
  private remainingBalls = [...this.gameBingoBalls];
  private io: Server;
  private timer: number = 5;
  public isGameStarted: boolean = false;

  constructor(io: Server) {
    this.io = io;
  }

  private inicializeBalls(): void {
    this.remainingBalls = [...this.gameBingoBalls];
  }

  private async saveBallToHistory(
    gameId: string,
    token: string,
    ball: BingoBall
  ): Promise<Pick<Game, "launchedBallsHistory">> {
    /**Añadir balota lanzada al historial */
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/bingo/ballHistory/${gameId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ball),
      }
    );

    if (!res.ok) {
      this.io.emit("message", "Error al guardar la balota en el historial");
    }

    const { data }: ServerResponse<Pick<Game, "launchedBallsHistory">> =
      await res.json();

    return data;
  }

  private launchRandomBall = async (
    gameId: string,
    token: string,
    players: number
  ) => {
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
    const updatedHistory = await this.saveBallToHistory(
      gameId,
      token,
      randomBall
    );

    this.io.emit("updated_history", { ...updatedHistory });

    this.timer = 5; // Reiniciar el temporizador
  };

  // Función para iniciar el temporizador de balotas
  private startTimer(gameId: string, token: string, players: number) {
    intervalId = setInterval(() => {
      if (this.timer === 0) {
        this.launchRandomBall(gameId, token, players);
      } else {
        this.timer--;
        this.io.emit("timer_update", this.timer); // Emitir el tiempo restante a los clientes
      }
    }, 1000);
  }

  public stopBallLaunching(): void {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      this.isGameStarted = false;
    }
  }

  public startBallLaunching(
    gameId: string,
    token: string,
    players: number
  ): void {
    if (!this.isGameStarted) {
      this.inicializeBalls();
      this.isGameStarted = true;
      this.startTimer(gameId, token, players);
    }
  }
}
