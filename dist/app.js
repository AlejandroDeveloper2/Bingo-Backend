"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
require("module-alias/register");
const index_1 = require("@routes/index");
const mongo_1 = __importDefault(require("@config/mongo"));
const utils_1 = require("./utils");
/* Inicializamos nuestro servidor con express */
const app = (0, express_1.default)();
/* Usamos cors para limitar el acceso a nuestra API */
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.urlencoded({ extended: true }));
/* Le decimos a express que toda la data que se va a manejar es de tipo JSON*/
app.use(express_1.default.json());
/* Usamos el enrutador para acceder a los endpoints  de nuestra API */
app.use(index_1.router);
/* Inicializamos el puerto donde se va a ejecutar nuestro servidor */
const port = process.env.PORT || 3000;
/* Ejecutamos nuestra función de  conexión para conectarnos a la base de datos */
(0, mongo_1.default)().then(() => console.log("Conexión lista"));
/**Creamos el servidor http */
const server = http_1.default.createServer(app);
/* Ejecutamos nuestro servidor en el puerto establecido */
server.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});
/**Socket IO */
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.URL_FRONTEND,
    },
});
/**Configuramos los eventos de nuestra conección Socket */
io.on("connection", (socket) => {
    console.log("a user connected");
    /** Inicializamos la clase para lanzar balotas aleatorias */
    const randomBallLauncher = new utils_1.RandomBallLauncher(io);
    socket.on("enter_game_room", ({ gameId, token }) => {
        var _a;
        socket.join("bingo_room");
        const roomSize = (_a = io.sockets.adapter.rooms.get("bingo_room")) === null || _a === void 0 ? void 0 : _a.size;
        // Iniciar el juego cuando el primer usuario se una a la sala
        if (!randomBallLauncher.isGameStarted && roomSize && roomSize >= 2) {
            randomBallLauncher.startBallLaunching(gameId, token);
        }
    });
    // Eliminar al cliente de una sala específica
    socket.on("leave_bingo_room", ({ roomName, players }) => {
        socket.leave(roomName);
        if (players <= 1) {
            randomBallLauncher.stopBallLaunching();
            console.log("Juego Terminado");
        }
    });
    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
    /** Eventos del bingo */
    socket.on("update_bingo_status", (updatedBingo) => {
        socket.broadcast.emit("updated_status", updatedBingo);
    });
    socket.on("join_to_bingo", (updatedBingo) => {
        socket.broadcast.emit("joined_to_bingo", updatedBingo);
    });
    socket.on("exit_from_bingo", (updatedBingo) => {
        socket.broadcast.emit("leave_bingo", updatedBingo);
    });
    socket.on("generate_card_bingo", (updatedBingo) => {
        socket.broadcast.emit("generated_card", updatedBingo);
    });
    socket.on("select_ball", (updatedBingo) => {
        socket.broadcast.emit("selected_ball", updatedBingo);
    });
    socket.on("win_game", (updatedBingo) => {
        socket.broadcast.emit("won_game", updatedBingo);
    });
    socket.on("reset_bingo", (updatedBingo) => {
        socket.broadcast.emit("reseted_bingo", updatedBingo);
    });
});
