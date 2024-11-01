import { BingoBallNameType } from "@interfaces/index";

export const verifyDiagonalMode = (
  ballName: BingoBallNameType,
  ballIndex: number
): boolean => {
  const diagonal: boolean =
    ballName === "B"
      ? ballIndex === 4
      : ballName === "I"
      ? ballIndex === 3
      : ballName === "N"
      ? false
      : ballName === "G"
      ? ballIndex === 1
      : ballIndex === 0;
  return diagonal;
};

export const verifyVerticalMode = (ballName: BingoBallNameType): boolean => {
  const vertical: boolean = ballName === "G";
  return vertical;
};

export const verifyHorizontalMode = (
  ballName: BingoBallNameType,
  ballIndex: number
): boolean => {
  const horizontal: boolean =
    ballName === "N" ? ballIndex === 2 : ballIndex === 3;
  return horizontal;
};

export const verifyCornersMode = (
  ballName: BingoBallNameType,
  ballIndex: number
): boolean => {
  const corners: boolean =
    ballName === "B" || ballName === "O"
      ? ballIndex === 0 || ballIndex === 4
      : false;
  return corners;
};
