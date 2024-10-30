import express, { Request, Response } from "express";
import cors from "cors";

/** Creamos el servidor con sus respectivas configuraciones */
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("¡Hola desde Express con TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});
