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
  | "BAD_REQUEST";

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
  sessionStatus: SessionStatus;
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

interface BingoBall {
  name: BingoBallNameType;
  number: number;
}

interface BingoCard {
  balls: BingoBall[];
  user: User;
  code: string;
}

interface Game {
  players: User[];
  winner: User | null;
  bingoCards: BingoCard[];
  randomBingoBalls: BingoBall[];
  gameMode: GameModeType;
  gameStatus: GameStatusType;
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
  BingoBall,
  BingoCard,
  Game,
};
