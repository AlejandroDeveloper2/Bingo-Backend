import express from "express";
import "dotenv/config";
import cors from "cors";

import { router } from "@routes/index";
import db from "@config/mongo";

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

/* Ejecutamos nuestro servidor en el puerto establecido */
app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});
