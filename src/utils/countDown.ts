import { Server } from "socket.io";

export let countdownTime: number = 5;
export let countdownInterval: NodeJS.Timeout;

// Función para iniciar el temporizador
const startCountdown = (io: Server) => {
  clearInterval(countdownInterval);
  countdownTime = 5; // Reiniciar el temporizador

  countdownInterval = setInterval(() => {
    countdownTime--;

    // Emitir el tiempo restante a todos los clientes conectados
    io.emit("timer_update", countdownTime);

    // Si el temporizador llega a cero, reiniciar
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

export default startCountdown;
