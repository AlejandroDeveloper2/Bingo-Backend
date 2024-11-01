import {
  Range,
  BingoBallNameType,
  BingoCard,
  BoardModel,
  User,
  BingoBall,
  GameModeType,
} from "@interfaces/index";

import {
  verifyCornersMode,
  verifyDiagonalMode,
  verifyHorizontalMode,
  verifyVerticalMode,
} from ".";

class BingoBoard {
  private user: User = {
    name: "",
    email: "",
    password: "",
    sessionStatus: "offline",
  };
  private balls: BingoBall[] = [];
  private code: string = "";

  constructor() {}

  private getRangePerBallName(ballName: BingoBallNameType): Range {
    const range: Range =
      ballName === "B"
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

  private getBallNumbersRange({ start, end }: Range): number[] {
    const ballNumbers: number[] = [];
    for (let i = start; i <= end; i++) {
      ballNumbers.push(i);
    }
    return ballNumbers;
  }
  private getRandomBallNumbers(
    elements: number[],
    elementAmount: number
  ): number[] {
    const elementsCopy: number[] = [...elements];

    for (let i = elementsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [elementsCopy[i], elementsCopy[j]] = [elementsCopy[j], elementsCopy[i]];
    }

    return elementsCopy.slice(0, elementAmount);
  }
  private getRandomBoardModel(): BoardModel {
    const bingoBallNames: BingoBallNameType[] = ["B", "I", "N", "G", "O"];
    let boardModel: BoardModel = {
      B: [],
      I: [],
      N: [],
      G: [],
      O: [],
    };

    for (let i = 0; i < bingoBallNames.length; i++) {
      const ballName = bingoBallNames[i];
      const range: Range = this.getRangePerBallName(ballName);
      const ballsNumbersPerName: number[] = this.getBallNumbersRange(range);
      if (ballName === "N") {
        boardModel = {
          ...boardModel,
          [ballName]: this.getRandomBallNumbers(ballsNumbersPerName, 4),
        };
      } else {
        boardModel = {
          ...boardModel,
          [ballName]: this.getRandomBallNumbers(ballsNumbersPerName, 5),
        };
      }
    }

    return boardModel;
  }

  private getBingoCardCode(): string {
    const characters: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code: string = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return `Carton-${code}`;
  }

  private enableBingoBall = (
    gameMode: GameModeType,
    ballIndex: number,
    ballName: BingoBallNameType
  ): boolean => {
    const diagonal: boolean = verifyDiagonalMode(ballName, ballIndex);
    const vertical: boolean = verifyVerticalMode(ballName);
    const horizontal: boolean = verifyHorizontalMode(ballName, ballIndex);
    const corners: boolean = verifyCornersMode(ballName, ballIndex);

    const isBingoBallEnabled: boolean =
      gameMode === "full"
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

  public setUser(user: User): void {
    this.user = user;
  }

  public generateBingoCard(gameMode: GameModeType): BingoCard {
    const boardModel = this.getRandomBoardModel();
    let balls: BingoBall[] = [];

    for (const key in boardModel) {
      if (Object.prototype.hasOwnProperty.call(boardModel, key)) {
        const parsedKey: BingoBallNameType = key as BingoBallNameType;
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

export default BingoBoard;
