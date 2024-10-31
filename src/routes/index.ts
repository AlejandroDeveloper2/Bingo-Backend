import { Router } from "express";
import { readdirSync } from "fs";

const ROUTER_PATH = `${__dirname}`;

const router = Router();

const cleanFileName = (fileName: string): string => {
  const file: string = `${fileName.split(".").shift()}`;
  return file;
};

readdirSync(ROUTER_PATH).filter((filename) => {
  const cleanedFileName: string = cleanFileName(filename);
  if (cleanedFileName !== "index") {
    import(`./${cleanedFileName}.route`).then((moduleRouter) => {
      router.use(`/api/${cleanedFileName}`, moduleRouter.router);
    });
  }
});

export { router };
