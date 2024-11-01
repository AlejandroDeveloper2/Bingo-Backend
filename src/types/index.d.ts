import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

type SessionStatusType = "online" | "offline";
type ErrorType =
  | "NOT_FOUND"
  | "RECORD_ALREADY"
  | "INCORRECT_PASSWORD"
  | "INVALID_TOKEN"
  | "INVALID_SESSION"
  | "SERVER_ERROR"
  | "BAD_REQUEST"
  | "EMPTY";

type GameModeType = "full" | "diagonal" | "vertical" | "horizontal" | "corners";
type BingoBallNameType = "B" | "I" | "N" | "G" | "O";
type GameStatusType = "ended" | "in-progress" | "waiting" | "unstart";

interface ServerResponse<T> {
  data: T;
  message: string;
  code: number;
}

interface RequestExt extends Request {
  user?: JwtPayload | string;
}

interface User {
  name: string;
  email: string;
  password: string;
  sessionStatus: SessionStatusType;
}

interface UserAuth {
  email: string;
  password: string;
}

interface UserSession {
  sessionToken: string;
  user: User;
}

interface UserSessionStatus {
  sessionStatus: SessionStatus;
}

interface Player extends Pick<User, "email" | "name"> {
  correctBallSelections: number;
}

interface BingoBall {
  name: BingoBallNameType;
  number: number;
  selected: boolean;
  enabled: boolean;
}

interface BoardModel {
  B: number[];
  I: number[];
  N: number[];
  G: number[];
  O: number[];
}

interface BingoCard {
  balls: BingoBall[];
  user: User;
  code: string;
}

interface Game {
  players: Player[];
  winner: User | null;
  bingoCards: BingoCard[];
  randomBingoBalls: BingoBall[];
  gameMode: GameModeType;
  gameStatus: GameStatusType;
}

interface Range {
  start: number;
  end: number;
}

interface PlayerSelection {
  playerEmail: string;
  selectedBall: BingoBall;
}

interface Winner {
  user: User;
  correctBallSelections: number;
  gameMode: GameModeType;
}

export type {
  SessionStatusType,
  ErrorType,
  GameModeType,
  BingoBallNameType,
  GameStatusType,
  ServerResponse,
  RequestExt,
  User,
  UserAuth,
  UserSession,
  UserSessionStatus,
  Player,
  BingoBall,
  BoardModel,
  BingoCard,
  Game,
  Range,
  PlayerSelection,
  Winner,
};
