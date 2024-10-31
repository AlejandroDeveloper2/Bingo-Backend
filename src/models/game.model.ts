import { Schema, model } from "mongoose";

import { BingoBall, BingoCard, Game, User } from "@interfaces/.";

const PlayerSchema = new Schema<Pick<User, "email" | "name">>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const BingoBallSchema = new Schema<BingoBall>(
  {
    name: {
      type: String,
      required: true,
      enum: ["B", "I", "N", "G", "O"],
    },
    number: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const BingoCardSchema = new Schema<BingoCard>(
  {
    balls: {
      type: [BingoBallSchema],
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const GameSchema = new Schema<Game>(
  {
    players: { type: [PlayerSchema], required: true },
    winner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    bingoCards: {
      type: [BingoCardSchema],
      required: true,
    },
    randomBingoBalls: {
      type: [BingoBallSchema],
      required: true,
    },
    gameMode: {
      type: String,
      required: true,
      enum: ["full", "diagonal", "vertical", "horizontal", "corners"],
    },
    gameStatus: {
      type: String,
      required: true,
      enum: ["ended", "in-progress", "waiting", "unstart"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GameModel = model("games", GameSchema);

export default GameModel;
