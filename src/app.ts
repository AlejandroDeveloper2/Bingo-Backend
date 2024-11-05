import express from "express";
import http from "http";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";

import { router } from "@routes/index";
import db from "@config/mongo";
import { Game } from "./types";

import { startCountdown } from "./utils";
import { countdownInterval, countdownTime } from "@utils/countDown";

/* Inicializamos nuestro servidor con express */
const app = express();

/* Usamos cors para limitar el acceso a nuestra API */
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));

/* Le decimos a express que toda la data que se va a manejar es de tipo JSON*/
app.use(express.json());

/* Usamos el enrutador para acceder a los endpoints  de nuestra API */
app.use(router);

/* Inicializamos el puerto donde se va a ejecutar nuestro servidor */
const port = process.env.PORT || 3000;

/* Ejecutamos nuestra función de  conexión para conectarnos a la base de datos */
db().then(() => console.log("Conexión lista"));

/**Creamos el servidor http */
const server = http.createServer(app);

/* Ejecutamos nuestro servidor en el puerto establecido */
server.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});

/**Socket IO */
const io = new Server(server, {
  cors: {
    origin: process.env.URL_FRONTEND,
  },
});

/**Configuramos los eventos de nuestra conección Socket */
io.on("connection", (socket) => {
  console.log("a user connected");

  /** Temporizador en tiempo real para lanzar balotas aleatorias */
  socket.on("start_countdown", () => {
    startCountdown(io);
    console.log("Timer iniciado");
    socket.emit("timer_update", countdownTime);
  });

  /* Limpiar el intervalo al desconectar*/
  socket.on("disconnect", () => {
    if (countdownInterval && io.engine.clientsCount === 0) {
      clearInterval(countdownInterval); // Limpia el temporizador si no hay clientes conectados
    }
  });

  /** Eventos del bingo */
  socket.on("update_bingo_status", (updatedBingo: Game) => {
    socket.broadcast.emit("updated_status", updatedBingo);
  });

  socket.on("join_to_bingo", (updatedBingo: Game) => {
    socket.broadcast.emit("joined_to_bingo", updatedBingo);
  });

  socket.on("exit_from_bingo", (updatedBingo: Game) => {
    socket.broadcast.emit("leave_bingo", updatedBingo);
  });

  socket.on("generate_card_bingo", (updatedBingo: Game) => {
    socket.broadcast.emit("generated_card", updatedBingo);
  });

  socket.on("launch_random_ball", (updatedBingo: Game) => {
    socket.broadcast.emit("launched_random_ball", updatedBingo);
  });

  socket.on("select_ball", (updatedBingo: Game) => {
    socket.broadcast.emit("selected_ball", updatedBingo);
  });

  socket.on("win_game", (updatedBingo: Game) => {
    socket.broadcast.emit("won_game", updatedBingo);
  });

  socket.on("reset_bingo", (updatedBingo: Game) => {
    socket.broadcast.emit("reseted_bingo", updatedBingo);
  });
});
